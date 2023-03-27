import { NextApiRequest, NextApiResponse } from "next";
// import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";
import { SurveyFeild } from "@prisma/client";

type expectedBody = {
  title: string;
  caseStudyId: string;
  description?: string;
  surveyFields?: SurveyFeild[];
  organizationId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { title, description, surveyFields, caseStudyId, organizationId } =
        req.body as expectedBody;
      console.log(req.body);
      console.log(req.query);
      const createSurvey = await prisma.survey.create({
        data: {
          title: String(title),
          description: String(description),
          SurveyField: {
            create: surveyFields,
          },

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
      return res
        .status(200)
        .json(formatResponse(createSurvey, "Success", "OK"));
    } catch {
      res
        .status(500)
        .json({ message: "Something went wrong : Could not create survey" });
    }
  }
}
