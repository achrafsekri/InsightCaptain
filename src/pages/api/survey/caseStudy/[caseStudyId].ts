import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { caseStudyId } = req.query;
      const surveys = await prisma.survey.findMany({
        where: {
          caseStudyId: String(caseStudyId),
        },
      });
      if (!surveys) {
        return res
          .status(404)
          .json(formatResponse(null, "Surveys not found", "404"));
      }

      res.status(200).json(formatResponse(surveys, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting surveys", "400"));
    }
  }
}
