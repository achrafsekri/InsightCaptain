import { NextApiRequest, NextApiResponse } from "next";
//
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";
import { ageGroups } from "../../../shared/constants";

type Body = {
  organizationId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(400).json(formatResponse(null, "Invalid request method", "400"));
  }
  if (req.method === "GET") {
    try {
      const { organizationId } = req.body as Body;
      const countriesWithMostResponses = await prisma.pollAnswer.groupBy({
        by: ["location"],
        where: {
          poll: {
            organizationId: organizationId,
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
        take: 5,
      });

      const CountryWithMostResponses = await prisma.pollAnswer.groupBy({
        by: ["location"],
        where: {
          poll: {
            organizationId: organizationId,
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
        take: 1,
      });

      const respondantsByAge = await prisma.pollAnswer.groupBy({
        by: ["age"],
        where: {
          poll: {
            organizationId: organizationId,
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
            organizationId: organizationId,
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
      const analytics = {
        countriesWithMostResponses,
        ageGroupsData,
        CountryWithMostResponses,
        totalRespondants
      };
      res.status(200).json(formatResponse(analytics, "Success", "200"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting stats a poll", "400"));
    }
  }
}
