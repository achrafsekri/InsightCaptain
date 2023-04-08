import { NextApiRequest, NextApiResponse } from "next";
// 
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import type { SurveyFeildOption } from "@prisma/client";
import type { SurveyFeild } from "@prisma/client";
import type { SurveyFeildType } from "@prisma/client";

type expectedPostBody = {
  title: string;
  type: SurveyFeildType;
  helperText?: string;
  surveyFeildOptions?: SurveyFeildOption;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { surveyId } = req.query;
  const { title, type, helperText, surveyFeildOptions } =
    req.body as expectedPostBody;

  if (req.method === "POST") {
    try {
      const createSurveyFeild: SurveyFeild = await prisma.surveyFeild.create({
        data: {
          title,
          type,
          helperText,
          surveyFeildOption: {
            create: surveyFeildOptions,
          },
          survey: {
            connect: {
              id: String(surveyId),
            },
          },
        },
      });
      return res
        .status(200)
        .json(formatResponse(createSurveyFeild, "Success", "201"));
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error creating survey feild", "400"));
    }
  }
}
