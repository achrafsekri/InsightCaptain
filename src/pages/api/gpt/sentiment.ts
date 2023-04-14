import { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../server/openai";
import { formatResponse } from "../../../shared/sharedFunctions";

type IncommingPrompt = {
  answer: string;
};

const generatePrompt = (prompt: string) => {
  return `Given this survey answer ${prompt}, please provide a sentiment analysis by selecting one of these options: [negative, positive, neutral]. return a JSON object with the following structure: { "result": [sentiment analysis result], "requests": [requested phrases from answers] }. only return the JSON object and nothing else. `;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //!change this to the url of the website that will be using this api
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://explain-this.vercel.app"
  );
  const { answer } = req.body as IncommingPrompt;
  const prompt = generatePrompt(answer);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 2048,
    });
    if (!completion?.data?.choices[0]?.text) {
      return res
        .status(500)
        .json(formatResponse(null, "Error generating completion", "500"));
    }
    const result = JSON.parse(completion?.data?.choices[0].text) as string;
    res.status(200).json(formatResponse(result, "Success", "200"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}
