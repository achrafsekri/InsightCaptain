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
  answer: {
    question: string;
    answer?: string;
  }[];
};

const generatePrompt = (ansewr) => {
  const prompt = ansewr.map((element, index) => {
    return ` answer${index} : ${element.answer} `;
  });
  return prompt.toString();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { answer } = req.body as Body;

      const prompt = generatePrompt(answer);

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
          .json(formatResponse(null, "Internal Server Error", "500"));
      }
      const keywords = result.items;
      const filteredKeywords = keywords.filter(
        (keyword) =>
          keyword.keyword !== "question" &&
          keyword.keyword !== "answer" &&
          keyword.keyword !== "question answer" &&
          keyword.importance > 0.5
      );
      // turn keyword to a string sepparated by commas
      const keywordsString = filteredKeywords
        .map((keyword) => {
          return keyword.keyword;
        })
        .join(", ");
      res
        .status(200)
        .json(formatResponse(keywordsString, "generated with success", "200"));
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json(formatResponse(null, "Internal Server Error", "500"));
    }
  }
}
