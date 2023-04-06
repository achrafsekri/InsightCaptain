import { NextApiRequest, NextApiResponse } from "next";
// import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

type expectedPatchBody = {
  title?: string;
  description?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { surveyId } = req.query;
      const getSurvey = await prisma.survey.findUnique({
        where: {
          id: String(surveyId),
        },
        include: {
          surveyField: true,
        },
      });
      if (!getSurvey) {
        return res
          .status(404)
          .json(formatResponse(null, "Survey not found", "404"));
      }

      return res.status(200).json(formatResponse(getSurvey, "Success", "201"));
    } catch {
      res.status(500).json(formatResponse(null, "Error getting survey", "400"));
    }
  } else {
    if (req.method === "PATCH") {
      try {
        const { surveyId } = req.query;
        const { title, description } = req.body as expectedPatchBody;

        const updateSurvey = await prisma.survey.update({
          where: {
            id: String(surveyId),
          },
          data: {
            title: String(title),
            description: String(description),
          },
        });

        return res
          .status(200)
          .json(formatResponse(updateSurvey, "Success", "201"));
      } catch {
        res
          .status(500)
          .json(formatResponse(null, "Error updating survey", "400"));
      }
    }

    if (req.method === "DELETE") {
      try {
        const { surveyId } = req.query;

        const deleteSurvey = await prisma.survey.delete({
          where: {
            id: String(surveyId),
          },
        });

        return res
          .status(200)
          .json(formatResponse(deleteSurvey, "Success", "201"));
      } catch {
        res
          .status(500)
          .json(formatResponse(null, "Error deleting survey", "400"));
      }
    }
  }
}
