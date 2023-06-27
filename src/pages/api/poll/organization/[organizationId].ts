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
      const polls = await prisma.poll.findMany({
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
        },
      });
      res.status(200).json(formatResponse(polls, "Success", "200"));
    } catch {
      res.status(500).json(formatResponse(null, "Error getting polls", "400"));
    }
  }
}
