import { NextApiRequest, NextApiResponse } from "next";
//or import { openai } from "../../../server/openai";
import { Configuration, OpenAIApi } from "openai";
import {
  formatResponse,
  extractContentBetweenBrackets,
} from "../../../shared/sharedFunctions";
import { prisma } from "../../../server/db";
import { Survey } from "@prisma/client";
import axios from "axios";

type Body = {
  surveyId: string;
};

const generatePrompt = (title: string, description: string, topic: string) => {
  return `Suggest 10 question for a survey called ${title} that has the following description ${description} and these topics ${topic} ,return a JSON object with the following structure: { "Q1": [first qestion here], "Q2": [second question here]  } for the whole 10 questions. only return the JSON object and nothing else. `;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { surveyId } = req.body as Body;
      const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
      });

      if (!survey) {
        return res
          .status(404)
          .json(formatResponse(null, "Survey not found", "404"));
      }
      const prompt = generatePrompt(
        survey.title,
        survey.description,
        survey.topic
      );
      let data = JSON.stringify({
        providers: "google",
        resolution: "512x512",
        text: prompt,
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        num_images: 1,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.edenai.run/v2/text/generation",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGZkNDliZGYtNjJhOS00NzljLWE0YWYtYzhlMDdmZDhmODc5IiwidHlwZSI6ImFwaV90b2tlbiJ9.miFu0-Y2sjNTfvgsZf-GprLREvO9wTC1GiB0c6EzfgI",
        },
        data: data,
      };
      const result = await axios.request(config).catch((error) => {
        console.error(error.message);
      });
      const returnedQuestions = JSON.parse(
        extractContentBetweenBrackets(result.data.google.generated_text)
      );

      res
        .status(200)
        .json(
          formatResponse(returnedQuestions, "generated with success", "200")
        );
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json(formatResponse(null, "Internal Server Error", "500"));
    }
  }
}
