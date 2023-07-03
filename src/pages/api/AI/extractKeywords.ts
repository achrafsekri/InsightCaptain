import { NextApiRequest, NextApiResponse } from "next";
//or import { openai } from "../../../server/openai";
import { Configuration, OpenAIApi } from "openai";
import {
  formatResponse,
  extractContentBetweenBrackets,
} from "../../../shared/sharedFunctions";
import { prisma } from "../../../server/db";
import axios from "axios";

type Body = {
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { text } = req.body as Body;

      const prompt = text;

      const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/text/keyword_extraction",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: ` Bearer ${process.env.EDEN_API_KEY}`,
        },
        data: {
          response_as_dict: true,
          attributes_as_list: false,
          show_original_response: false,
          providers: "ibm",
          text: prompt,
        },
      };

      const result = await axios
        .request(options)
        .then(function (response) {
          return response.data.ibm;
        })
        .catch(function (error) {
          throw error;
        });
      if (result.status !== "success") {
        return res
          .status(500)
          .json(formatResponse(null, "ibm error", "500"));
      }
      const keywords = result.items;

      res
        .status(200)
        .json(formatResponse(keywords, "generated with success", "200"));
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json(formatResponse(null, "Internal Server Error", "500"));
    }
  }
}
