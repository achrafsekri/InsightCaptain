import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import axios from "axios";

import type {
  Survey,
  SurveyAnswer,
  SurveyFeildAnswer,
  SurveyFeildOption,
} from "@prisma/client";

type expectedPostBody = {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  ipAddress?: string;
  location?: string;
  answer: Answer;
};

type SurveyAnswers = {
  data: SurveyAnswer[] | null;
  SurveyeesCount: number;
};

type SurveyAnswerReturn = {
  id: string;
  fullName: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  age?: number | null;
  location?: string | null;
  ipAddress?: string | null;
  surveyId: string;
  surveyAnswers: (SurveyFeildAnswer | undefined)[];
};

type FormattedAnswer = {
  quotation: string;
  answer?: string;
}[];

type Answer = {
  surveyFieldId: string;
  surveyFieldTitle: string;
  answer?: string;
  pickedOptions?: {
    id: string;
    pickedOptionLable: string;
  }[];
  type: string;
}[];

type Sentiment = {
  result: string;
  requests: string[];
};

// getFormattedAnswer is a function that formats the answer to the format that GPT-3 expects
const getFormattedAnswer = (answers: Answer) => {
  const reternedAnswer = answers.map((answer) => {
    if (answer.type === "radio" && answer.pickedOptions?.length === 1) {
      return {
        quotation: answer.surveyFieldTitle,
        answer: answer.pickedOptions.map((option) => option.pickedOptionLable),
      };
    }
    if (answer.type === "checkbox" && answer.pickedOptions) {
      return {
        quotation: answer.surveyFieldTitle,
        answer: answer.pickedOptions.map((option) => option.pickedOptionLable),
      };
    }
    if (answer.type === "text") {
      return {
        quotation: answer.surveyFieldTitle,
        answer: answer.answer,
      };
    }
  }) as FormattedAnswer;
  return reternedAnswer;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { surveyId } = req.query;
    const { answer, email, fullName, phoneNumber, age, location, ipAddress } =
      req.body as expectedPostBody;
    const SurveyAnswerReturn = {} as SurveyAnswerReturn;

    try {
      const survey: Survey | null = await prisma.survey.findUnique({
        where: {
          id: String(surveyId),
        },
      });
      if (!survey) {
        return res
          .status(404)
          .json(formatResponse(null, "Survey not found", "404"));
      }

      // get sentiment analysis of the answer and most requested topics and save it to the database for future use
      const GptFormattedAnswer = JSON.stringify(getFormattedAnswer(answer));
      const data = JSON.stringify({
        answer: GptFormattedAnswer,
      });
      const SentimentAnalysis = await axios.get(
        "http://localhost:3000/api/gpt/sentiment",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        }
      );

      const sentiment = SentimentAnalysis.data.data as Sentiment;

      console.log("sentiment", sentiment.result[0]);

      // save the answer to the database
      const surveyAnswer: SurveyAnswer = await prisma.surveyAnswer.create({
        data: {
          surveyId: surveyId as string,
          email,
          fullName,
          sentiment: sentiment.result[0]?.toUpperCase(),
          requested: sentiment.requests.join(", "),
          phoneNumber,
          age,
          location: location,
          ipAddress: ipAddress,
        },
      });

      const surveyAnswerFilling = await Promise.all(
        answer.map(async (answer) => {
          if (answer.type === "text") {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswerId: surveyAnswer.id,
                surveyFieldId: answer.surveyFieldId,
                answer: answer.answer,
              },
            });
          }
          if (answer.type === "radio" && answer.pickedOptions?.length === 1) {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswerId: surveyAnswer.id,
                surveyFieldId: answer.surveyFieldId,
                pickedOptions: {
                  connect: {
                    id: answer?.pickedOptions[0].id,
                  },
                },
              },
            });
          }
          if (answer.type === "checkbox" && answer.pickedOptions) {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswerId: surveyAnswer.id,
                surveyFieldId: answer.surveyFieldId,
                pickedOptions: {
                  connect: answer?.pickedOptions.map((option) => ({
                    id: option.id,
                  })),
                },
              },
            });
          }
        })
      );
      SurveyAnswerReturn.id = surveyAnswer.id;
      SurveyAnswerReturn.surveyId = surveyAnswer.surveyId;
      SurveyAnswerReturn.surveyAnswers = surveyAnswerFilling;
      SurveyAnswerReturn.phoneNumber = surveyAnswer.phoneNumber;
      SurveyAnswerReturn.email = surveyAnswer.email;
      SurveyAnswerReturn.fullName = surveyAnswer.fullName;
      SurveyAnswerReturn.age = surveyAnswer.age;
      SurveyAnswerReturn.location = surveyAnswer.location;
      SurveyAnswerReturn.ipAddress = surveyAnswer.ipAddress;
      return res
        .status(201)
        .json(formatResponse(SurveyAnswerReturn, "Success", "201"));
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json(formatResponse(null, "Error answering survey", "400"));
    }
  }

  if (req.method === "GET") {
    const { surveyId } = req.query;
    const SurveyAnswers = {} as SurveyAnswers;
    try {
      const surveyAnswer: SurveyAnswer[] | null =
        await prisma.surveyAnswer.findMany({
          where: {
            surveyId: String(surveyId),
          },
          include: {
            surveyFeildAnswer: true,
          },
        });
      if (!surveyAnswer) {
        return res
          .status(404)
          .json(formatResponse(null, "Answer not found", "404"));
      }
      SurveyAnswers.data = surveyAnswer;
      SurveyAnswers.SurveyeesCount = surveyAnswer.length;
      return res
        .status(200)
        .json(formatResponse(SurveyAnswers, "Success", "200"));
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json(formatResponse(null, "Error getting answer", "400"));
    }
  }
}
