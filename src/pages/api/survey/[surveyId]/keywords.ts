import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import axios from "axios";

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

      const requested = await prisma.surveyAnswer.findMany({
        where: {
          surveyId: String(surveyId),
        },
        select: {
          requested: true,
        },
      });
      const requestedKeywords = requested.map((item) => item.requested);
      const requestedKeywodsAsArray = requestedKeywords.map((item) =>
        item.split(" ")
      );
      //remove , and . from keywords
      //   requestedKeywodsAsArray.forEach((item) => {
      //     item.forEach((word, index) => {
      //       if (word.includes(",")) {
      //         item[index] = word.replace(",", "");
      //       }
      //       if (word.includes(".")) {
      //         item[index] = word.replace(".", "");
      //       }
      //     });
      //   });
      const requestedKeywordsFlat = requestedKeywodsAsArray.flat();
      const requestedKeywordsString = requestedKeywordsFlat.join(" ");

      const data = JSON.stringify({
        text: requestedKeywordsString,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/AI/extractKeywords",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const response = await axios.request(config).catch((err) => {
        throw err;
      });
      if (response.data.data.length > 20) {
        response.data.data = response.data.data.slice(0, 20);
      }
      res
        .status(200)
        .json(formatResponse(response.data.data, "Success", "200"));
    } catch {
      res.status(500).json(formatResponse(null, "Error getting survey", "400"));
    }
  }
}
