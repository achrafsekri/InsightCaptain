import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import type { Survey, SurveyAnswer } from "@prisma/client";

type stats = {
  totalResponses?: number;
  totalQuestions?: number;
  locationwithmostresponses?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { surveyId } = req.query;
      const getSurvey = await prisma.survey.findUnique({
        where: {
          id: String(surveyId),
        },
        include: {
          surveyField: true,
        },
      });
      if (!getSurvey) {
        return res
          .status(404)
          .json(formatResponse(null, "Survey not found", "404"));
      }

      const getStats: stats = {};
      const getResponses: SurveyAnswer[] = (await prisma.surveyAnswer.findMany({
        where: {
          surveyId: String(surveyId),
        },
        include: {
          surveyFeildAnswer: true,
        },
      })) as SurveyAnswer[];

      getStats.totalResponses = getResponses.length;
      getStats.totalQuestions = getSurvey.surveyField.length;
      const locationwithmostresponses = getResponses.reduce((acc, curr) => {
        if (acc[curr.location]) {
          acc[curr.location] += 1;
        } else {
          acc[curr.location] = 1;
        }
        return acc;
      }, {} as { [key: string]: number });
      locationwithmostresponses["null"] = 0; // if no location is provided
      getStats.locationwithmostresponses = Object.keys(
        locationwithmostresponses
      ).reduce((a, b) =>
        locationwithmostresponses[a] > locationwithmostresponses[b] ? a : b
      );

      return res.status(200).json(formatResponse(getStats, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting survey stats", "400"));
    }
  }
}
