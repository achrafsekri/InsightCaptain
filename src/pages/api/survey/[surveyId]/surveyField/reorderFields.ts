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
  order: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reorderedItems } = req.body;
  if (req.method != "PATCH") {
    return res.status(405).json(formatResponse(405, "Method Not Allowed"));
  }
  try {
    reorderedItems.forEach(async (item: SurveyFeild) => {
      await prisma.surveyFeild.update({
        where: {
          id: item.id,
        },
        data: {
          order: reorderedItems.indexOf(item),
        },
      });
    });
    return res.status(200).json(formatResponse("", "Success", "200"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(formatResponse("", "Internal Server Error", "500"));
  }
}
