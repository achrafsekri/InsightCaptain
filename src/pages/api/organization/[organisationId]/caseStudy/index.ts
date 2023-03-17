import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

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
      const { title, description, image } = req.body;
      const createCaseStudy = await prisma.caseStudy.create({
        data: {
          title,
          description,
          image,
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
