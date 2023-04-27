import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import type { Survey, SurveyAnswer } from "@prisma/client";

enum Sentiment {
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral",
}

type stats = {
  totalResponses?: number;
  totalQuestions?: number;
  locationwithmostresponses?: string;
  sentiment?: Sentiment;
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

      const sentiment = getResponses.reduce((acc, curr) => {
        if (acc[curr.sentiment]) {
          acc[curr.sentiment] += 1;
        } else {
          acc[curr.sentiment] = 1;
        }
        return acc;
      }, {} as { [key: string]: number });
      sentiment["null"] = 0; // if no sentiment is provided
      getStats.sentiment = Object.keys(sentiment).reduce((a, b) =>
        sentiment[a] > sentiment[b] ? a : b
      ) as Sentiment;

      return res.status(200).json(formatResponse(getStats, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting survey stats", "400"));
    }
  }
}
