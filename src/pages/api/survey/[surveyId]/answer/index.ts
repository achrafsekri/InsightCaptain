import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

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
  answer: {
    surveyFieldId: string;
    surveiFieldTitle: string;
    answer?: string;
    pickedOptions?: {
      id: string;
      pickedOptionLable: string;
    }[];
    type: string;
  }[];
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

const getFormattedAnswer = (answers: any) => {
  const reternedAnswer = answers.map((answer: any) => {
    if (answer.type === "radio") {
      return {
        quotation: answer.surveyFieldTitle,
        pickedOptions: answer.pickedOptions.map(
          (option: any) => option.pickedOptionLable
        ),
      };
    }
    if (answer.type === "checkbox") {
      return {
        quotation: answer.surveyFieldTitle,
        pickedOptions: answer.pickedOptions.map(
          (option: any) => option.pickedOptionLable
        ),
      };
    }
    if (answer.type === "text") {
      return {
        quotation: answer.surveyFieldTitle,
        answer: answer.answer,
      };
    }
  });
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
      const surveyAnswer: SurveyAnswer = await prisma.surveyAnswer.create({
        data: {
          surveyId: surveyId as string,
          email,
          fullName,
          phoneNumber,
          age,
          location: location,
          ipAddress: ipAddress,
        },
      });
      const GptFormattedAnswer = getFormattedAnswer(answer);
      console.log(GptFormattedAnswer);
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
          if (answer.type === "radio") {
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
          if (answer.type === "checkbox") {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswerId: surveyAnswer.id,
                surveyFieldId: answer.surveyFieldId,
                pickedOptions: {
                  connect: answer?.pickedOptions?.map((option) => option.id),
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
