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
      const { pollId } = req.query;
      const countriesWithMostResponses = prisma.pollAnswer.groupBy({
        by: ["location"],
        where: {
          pollId: pollId as string,
        },
        _count: {
          location: true,
        },
        orderBy: {
          _count: {
            location: "desc",
          },
        },
        take: 5,
      });
      const respondantsByAge = await prisma.pollAnswer.groupBy({
        by: ["age"],
        where: {
          poll: {
            id: pollId as string,
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
      const totalRespondants = await prisma.pollAnswer.count({
        where: {
          poll: {
            id: pollId as string,
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

      const stats = {
        countriesWithMostResponses:
          countriesWithMostResponses == {} ? countriesWithMostResponses : [],
        totalRespondants,
        ageGroupsData,
      };
      res.status(200).json(formatResponse(stats, "Polll stats", "200"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting poll stats", "400"));
    }
  }
}
