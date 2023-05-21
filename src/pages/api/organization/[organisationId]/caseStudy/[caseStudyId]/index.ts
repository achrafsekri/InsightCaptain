import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../../server/db";
import { formatResponse } from "../../../../../../shared/sharedFunctions";

type Body = {
  title: string;
  description: string;
  image: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organisationId: organizationId, caseStudyId } = req.query;
  if (req.method === "GET") {
    try {
      const getCaseStudy = await prisma.caseStudy.findMany({
        where: {
          organizationId: organizationId as string,
          id: caseStudyId as string,
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
  if (req.method === "PATCH") {
    try {
      const { title, description, image } = req.body as Body;
      const updateCaseStudy = await prisma.caseStudy.update({
        where: {
          id: caseStudyId as string,
        },
        data: {
          title,
          description,
          image,
        },
      });
      res
        .status(200)
        .json(
          formatResponse(
            updateCaseStudy,
            "Case study updated successufuly",
            "200"
          )
        );
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleteCaseStudy = await prisma.caseStudy.delete({
        where: {
          id: caseStudyId as string,
        },
      });
      res
        .status(200)
        .json(formatResponse(null, "Case study deleted successufuly", "200"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
}
