import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import { SurveyAnswer } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { answerId } = req.query;
    try {
      const surveyAnswer: SurveyAnswer | null =
        await prisma.surveyAnswer.findUnique({
          where: {
            id: String(answerId),
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
