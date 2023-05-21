import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

type Body = {
  title: string;
  description: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (req.method === "POST") {
    try {
      const { organisationId: organizationId } = req.query;
      const { title, description } = req.body as Body;
      const createCaseStudy = await prisma.caseStudy.create({
        data: {
          title,
          description,
          
          organization: {
            connect: {
              id: organizationId as string,
            },
          },
        },
      });
      res
        .status(200)
        .json(
          formatResponse(
            createCaseStudy,
            "Case study created successufuly",
            "200"
          )
        );
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
  if (req.method === "GET") {
    try {
      const { organisationId: organizationId } = req.query;
      const getCaseStudy = await prisma.caseStudy.findMany({
        where: {
          organizationId: organizationId as string,
        },
      });
      res
        .status(200)
        .json(
          formatResponse(getCaseStudy, "Case study fetched successufuly", "200")
        );
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
}
