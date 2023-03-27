import { NextApiRequest,NextApiResponse } from "next";
// import { authOptions } from  "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method === "POST") {

        try{
            const { surveyId } = req.query;
            const { title } = req.body;

                const createSurveyField = await prisma.surveyField.create({
                   
                    data: {
    
                        title: String(title),

                        survey: {
                            connect: {
                              id: String(surveyId),
                            },  
                          },
                        
                    }
                })

        return res.status(200).json(formatResponse(createSurveyField,"Success","OK"));
        
    }catch{res.status(500).json({message:"Something went wrong : Could'nt create Survey Field"})}; 
}
}
