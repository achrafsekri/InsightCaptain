import { NextApiRequest, NextApiResponse } from "next";
// import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { surveyFieldId } = req.query;
  if (req.method === "GET") {
    try {
      const surveyField = await prisma.SurveyFeild.findUnique({
        where: {
          id: String(surveyFieldId),
        },
      });
      return res
        .status(200)
        .json(formatResponse(surveyField, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting survey field", "400"));
    }
  }

  if (req.method === "PATCH") {
    const { title, type, helperText } = req.body;
    try {
      const surveyField = await prisma.SurveyFeild.update({
        where: {
          id: String(surveyFieldId),
        },
        data: {
          title,
          type,
          helperText,
        },
      });
      return res
        .status(200)
        .json(formatResponse(surveyField, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error updating survey field", "400"));
    }
  }

  if (req.method === "DELETE") {
    try {
      const surveyField = await prisma.SurveyFeild.delete({
        where: {
          id: String(surveyFieldId),
        },
      });
      return res
        .status(200)
        .json(formatResponse(surveyField, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error deleting survey field", "400"));
    }
  }
}
