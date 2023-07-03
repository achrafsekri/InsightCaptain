import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import axios from "axios";
import { type Sentiment as PrismaSentiment } from "@prisma/client";

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
  requested?: string | null;
  sentiment?: string | null;
};

type FormattedAnswer = {
  question: string;
  answer?: string;
}[];

type Answer = {
  surveyFieldId: string;
  surveyFieldTitle: string;
  answer?: string;
  pickedOptions?: string[] | string;
  type: string;
}[];

type Sentiment = {
  result: string[];
  requests: string[];
};

type SentimentAnalysis = {
  data: {
    data: Sentiment;
  };
};

// getFormattedAnswer is a function that formats the answer to the format that GPT-3 expects
const getFormattedAnswer = (answers: Answer) => {
  const reternedAnswer = answers.map((answer) => {
    if (
      answer.surveyFeild.type === "RADIO" &&
      answer.pickedOptions?.length === 1
    ) {
      return {
        question: answer.surveyFeild.title,
        answer: answer.pickedOptions.map((option) => option.title),
      };
    }
    if (answer.surveyFeild.type === "CHECKBOX" && answer.pickedOptions) {
      return {
        question: answer.surveyFeild.title,
        answer: answer.pickedOptions.map((option) => option.title),
      };
    }
    if (answer.surveyFeild.type === "TEXT") {
      return {
        question: answer.surveyFeild.title,
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
    const { answer, email, fullName, age, location, ipAddress } =
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
      // const GptFormattedAnswer = JSON.stringify(getFormattedAnswer(answer));
      // const data = JSON.stringify({
      //   answer: GptFormattedAnswer,
      // });
      // const SentimentAnalysis: SentimentAnalysis = await axios.get(
      //   "http://localhost:3000/api/gpt/sentiment",
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     data: data,
      //   }
      // );

      // const sentiment = SentimentAnalysis.data.data;

      // console.log("sentiment", sentiment.result[0]);

      // save the answer to the database
      const surveyAnswer: SurveyAnswer = await prisma.surveyAnswer.create({
        data: {
          surveyId: surveyId as string,
          email,
          fullName,
          age,
          location: location,
          ipAddress: ipAddress,
          createdAtMonth: new Date().getMonth(),
        },
      });

      const surveyAnswerFilling = await Promise.all(
        answer.map(async (answer) => {
          if (answer.type === "text") {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswer: {
                  connect: {
                    id: surveyAnswer.id,
                  },
                },
                surveyFeild: {
                  connect: {
                    id: answer.surveyFieldId,
                  },
                },
                answer: answer.answer,
              },
            });
          }
          if (answer.type === "radio") {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswer: {
                  connect: {
                    id: surveyAnswer.id,
                  },
                },
                surveyFeild: {
                  connect: {
                    id: answer.surveyFieldId,
                  },
                },
                pickedOptions: {
                  connect: {
                    id: answer?.pickedOptions,
                  },
                },
              },
            });
          }
          if (answer.type === "checkbox" && answer.pickedOptions) {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswer: {
                  connect: {
                    id: surveyAnswer.id,
                  },
                },
                surveyFeild: {
                  connect: {
                    id: answer.surveyFieldId,
                  },
                },
                pickedOptions: {
                  connect: answer?.pickedOptions.map((option) => ({
                    id: option,
                  })),
                },
              },
            });
          }
        })
      );
      // sentiment analysis and most requested topics
      const SurveyAnswerReturn = await prisma.surveyAnswer.findUnique({
        where: {
          id: surveyAnswer.id,
        },
        include: {
          surveyFeildAnswer: {
            include: {
              pickedOptions: true,
              surveyFeild: true,
            },
          },
        },
      });
      const sentimentPayload = {
        answer: getFormattedAnswer(SurveyAnswerReturn.surveyFeildAnswer),
      };

      const data = JSON.stringify(sentimentPayload);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/AI/sentiment",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const sentiment = await axios.request(config).catch((err) => {
        return "failed";
      });
      if (sentiment !== "failed") {
        const sentimentResult =
          sentiment.data.data.google.general_sentiment.toUpperCase();

        await prisma.surveyAnswer.update({
          where: {
            id: surveyAnswer.id,
          },
          data: {
            sentiment: sentimentResult,
          },
        });
      }

      const mostRequestedConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/AI/keywords",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const mostRequested = await axios
        .request(mostRequestedConfig)
        .catch((err) => {
          return "error";
        });
      if (mostRequested !== "error") {
        const mostRequestedResult = mostRequested.data.data;
        await prisma.surveyAnswer.update({
          where: {
            id: surveyAnswer.id,
          },
          data: {
            requested: mostRequestedResult,
          },
        });
      }
      const finalAnswer = await prisma.surveyAnswer.findUnique({
        where: {
          id: surveyAnswer.id,
        },
        include: {
          surveyFeildAnswer: {
            include: {
              pickedOptions: true,
              surveyFeild: true,
            },
          },
        },
      });

      return res
        .status(201)
        .json(formatResponse(finalAnswer, "Success", "201"));
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json(formatResponse(null, "Error answering survey", "400"));
    }
  }

  if (req.method === "GET") {
    const { surveyId } = req.query;
    try {
      const surveyAnswer = await prisma.surveyAnswer.findMany({
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

      return res
        .status(200)
        .json(formatResponse(surveyAnswer, "Success", "200"));
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json(formatResponse(null, "Error getting answer", "400"));
    }
  }
}
