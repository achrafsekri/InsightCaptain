import { NextApiRequest, NextApiResponse } from "next";
//
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import { type SurveyFeildType } from "@prisma/client";

type Body = {
  title: string;
  order: number;
  helperText: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { surveyFieldId } = req.query;
  if (req.method === "GET") {
    try {
      const surveyField = await prisma.surveyFeild.findUnique({
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
    const { title, helperText, order } = req.body as Body;
    try {
      const surveyField = await prisma.surveyFeild.update({
        where: {
          id: String(surveyFieldId),
        },
        data: {
          title,
          helperText,
          order,
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
      const surveyField = await prisma.surveyFeild.delete({
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
