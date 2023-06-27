import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { organizationId } = req.query;
      const surveys = await prisma.survey.findMany({
        where: {
          organizationId: String(organizationId),
        },
        include: {
          caseStudy: {
            select: {
              title: true,
              id: true,
            },
          },
          _count: {
            select: {
              SurveyAnswer: true,
            },
          },
        },
      });
      res.status(200).json(formatResponse(surveys, "Success", "200"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting surveys", "400"));
    }
  }
}
