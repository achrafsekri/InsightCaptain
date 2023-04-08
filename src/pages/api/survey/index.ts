import { NextApiRequest, NextApiResponse } from "next";
// 
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type expectedBody = {
  title: string;
  caseStudyId: string;
  description?: string;
  organizationId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { title, description, caseStudyId, organizationId } =
        req.body as expectedBody;
      console.log(req.body);
      const createSurvey = await prisma.survey.create({
        data: {
          title: String(title),
          description: String(description),

          caseStudy: {
            connect: {
              id: caseStudyId,
            },
          },
          organization: {
            connect: {
              id: organizationId,
            },
          },
        },
      });
      console.log(createSurvey);
      return res
        .status(200)
        .json(formatResponse(createSurvey, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error creating a survey", "400"));
    }
  }
}
