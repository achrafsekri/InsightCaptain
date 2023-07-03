import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import type { Survey, SurveyAnswer } from "@prisma/client";
import { ageGroups } from "../../../../shared/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { surveyId } = req.query;

      const TopCountryWithMostResponses = await prisma.surveyAnswer.groupBy({
        by: ["location"],
        where: {
          survey: {
            id: surveyId as string,
          },
        },
        _count: {
          location: true,
        },
        orderBy: {
          _count: {
            location: "desc",
          },
        },
        take: 6,
      });

      const respondantsByAge = await prisma.surveyAnswer.groupBy({
        by: ["age"],
        where: {
          survey: {
            id: surveyId as string,
          },
        },
        _count: {
          age: true,
        },
        orderBy: {
          _count: {
            age: "desc",
          },
        },
        take: 6,
      });
      const totalRespondants = await prisma.surveyAnswer.count({
        where: {
          survey: {
            id: surveyId as string,
          },
        },
      });

      const ageGroupsData = ageGroups.map((group) => {
        const ageGroup = respondantsByAge.find((age) => {
          return age.age >= group.over && age.age <= group.under;
        });
        if (ageGroup) {
          return {
            name: group.name,
            value: ageGroup._count.age,
            persantage: (ageGroup._count.age / totalRespondants) * 100,
          };
        }
        return {
          name: group.name,
          value: 0,
          persantage: 0,
        };
      });

      const sentiments = await prisma.surveyAnswer.groupBy({
        by: ["sentiment"],
        where: {
          survey: {
            id: surveyId as string,
          },
        },
        _count: {
          sentiment: true,
        },
        orderBy: {
          _count: {
            sentiment: "desc",
          },
        },
        take: 3,
      });

      const sentimentsFormatted = sentiments.map((sentiment) => {
        return {
          name: sentiment.sentiment,
          value: sentiment._count.sentiment,
          persantage: (sentiment._count.sentiment / totalRespondants) * 100,
        };
      });

      // if there is no Postive or negative or neutral response fill them with 0
      if (sentimentsFormatted.length < 3) {
        const sentimentsNames = sentimentsFormatted.map(
          (sentiment) => sentiment.name
        );
        const sentimentsToAdd = ["POSITIVE", "NEGATIVE", "NEUTRAL"].filter(
          (sentiment) => !sentimentsNames.includes(sentiment)
        );
        sentimentsToAdd.forEach((sentiment) => {
          sentimentsFormatted.push({
            name: sentiment,
            value: 0,
            persantage: 0,
          });
        });
      }

      const stats = {
        countriesWithMostResponses:
          TopCountryWithMostResponses == {} ? [] : TopCountryWithMostResponses,
        countryWithMostResponses:
        TopCountryWithMostResponses == {} ? [] : TopCountryWithMostResponses[0],
        totalRespondants,
        ageGroupsData,
        sentiments: sentimentsFormatted,
        responses: TopCountryWithMostResponses,
      };
      res.status(200).json(formatResponse(stats, "Survey stats", "200"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting survey stats", "400"));
    }
  }
}
