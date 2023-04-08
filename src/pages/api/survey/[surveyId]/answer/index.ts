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
  answer: {
    surveyFieldId: string;
    answer: string;
    pickedOptions?: SurveyFeildOption[];
    type: string;
  }[];
};

type SurveyAnswers = {
  data: SurveyAnswer[] | null;
  SurveyeesCount: number;
};

type SurveyAnswerReturn = {
  id: string;
  surveyId: string;
  surveyAnswers: SurveyFeildAnswer[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { surveyId } = req.query;
    const { answer } = req.body as expectedPostBody;
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
          if (answer.type === "radio") {
            return await prisma.surveyFeildAnswer.create({
              data: {
                surveyAnswerId: surveyAnswer.id,
                surveyFieldId: answer.surveyFieldId,
                pickedOptions: answer.pickedOptions as SurveyFeildOption[],
              },
            });
          }
        })
      );
      SurveyAnswerReturn.id = surveyAnswer.id;
      SurveyAnswerReturn.surveyId = surveyAnswer.surveyId;
      SurveyAnswerReturn.surveyAnswers = surveyAnswerFilling;
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
