import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.GPT_API_Key,
});

export const openai = new OpenAIApi(configuration);
