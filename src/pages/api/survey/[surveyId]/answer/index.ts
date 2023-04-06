import { NextApiRequest, NextApiResponse } from "next";
// import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { Survey } from "@prisma/client";

type expectePostdBody = {
  answer: {
    surveyFeildId: string;
    answer: string;
    pickedOptions: string[];
    type: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { surveyId } = req.query;
    const { answer } = req.body as expectePostdBody;

    try {
      const survey = await prisma.survey.findUnique({
        where: {
          id: String(surveyId),
        },
      });
      if (!survey) {
        return res
          .status(404)
          .json(formatResponse(null, "Survey not found", "404"));
      }
      const surveyAnswer = await prisma.surveyAnswer.create({
        data: {
          surveyId,
        },
      });
      const surveyAnswerFilling = answer.map(async (answer) => {
        if (answer.type === "text") {
          const answerSurvey = await prisma.SurveyFeildAnswer.create({
            data: {
              surveyFeild: {
                connect: {
                  id: answer.surveyFeildId,
                },
              },
              answer: answer.answer,
              surveyAnswer: {
                connect: {
                  id: surveyAnswer.id,
                },
              },
            },
          });
        }
      });
      return res
        .status(200)
        .json(formatResponse(surveyAnswerFilling, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error answering survey", "400"));
    }
  }
}
