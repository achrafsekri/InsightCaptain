import { NextApiRequest, NextApiResponse } from "next";
//or import { openai } from "../../../server/openai";
import { Configuration, OpenAIApi } from "openai";
import { formatResponse } from "../../../shared/sharedFunctions";
import { prisma } from "../../../server/db";
import { Survey } from "@prisma/client";

const configuration = new Configuration({
    apiKey: process.env.GPT_API_Key,
});

const openai = new OpenAIApi(configuration);


type SentPrompt2Openai = {
    sentSurvey: Survey;
};

const generatePrompt = (prompt: string) => {
    return `Suggest 10 question that are different from what is there already in the whole surveyField (if there is no surveyfield no problem or if its just a text or a description) from here:${prompt},return a JSON object with the following structure: { "Q1": [first qestion here], "Q2": [second question here]  } ofcourse for the whole 10 questions. only return the JSON object and nothing else. `;
};


export default async function handler(

    req: NextApiRequest,
    res: NextApiResponse

) {

    if(req.method === "GET") {

        try{

    const {surveyid} = req.body;
    const getSurvey = await prisma.survey.findUnique({

        where: {
            id: surveyid as string,
        }

    });

        if(!getSurvey) { 

            return res.status(404).json(formatResponse(null, "Survey not found", "404"));}

    //const { sentText } = req.body as SentPrompt2Openai;
    const Prompt = generatePrompt(JSON.stringify(getSurvey));
    //const Prompt = generatePrompt(sentText);

    try{
            
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: Prompt,
                temperature: 0.2,
                max_tokens: 2048,
            });

    const result=completion?.data
    console.log(result)
    return res.status(200).json({ result });

        } catch (err) {res.status(500).json(formatResponse(null, "Prompt sending or reception went wrong ", "500"));}

        } catch (err) {
            console.error(err);
            res.status(500).json(formatResponse(null, "Internal Server Error", "500"));
        }

    }

}


