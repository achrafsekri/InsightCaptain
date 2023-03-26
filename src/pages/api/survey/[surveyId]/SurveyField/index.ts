import { NextApiRequest,NextApiResponse } from "next";
// import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method === "GET"){
        try {
            const {surveyFid} = req.query;
            const getSurveyField = await prisma.surveyField.findUnique({
                where:{
                    id: String(surveyFid)
                },
                select:{
                    id: true,
                    title: true,
                }
            });
        if(!getSurveyField) {
        return res.status(404).json(formatResponse(null,"SurveyField not found","NOT_FOUND"));}
            
            return res.status(200).json(formatResponse(getSurveyField,"Success","OK"));
        } catch {
            res.status(500).json({message:"Something went wrong"})
        }
    }else{ 


        if(req.method === "PATCH"){
            try{
                const {surveyFid} = req.query;
                const {title} = req.body;
                const updateSurveyField = await prisma.surveyField.update({
                    where:{

                        id: String(surveyFid)
                    },
                    data:{
                        title: String(title)
                    },   
                });
                
               
                return res.status(200).json(formatResponse(updateSurveyField,"Success","OK"))
            }catch{
                res.status(500).json({message:"Something went wrong : Could'nt update Survey Field"})
            }
        }


        if(req.method === "DELETE"){
            try{
                const {surveyFid} = req.query;
                const deleteSurveyField = await prisma.surveyField.delete({
                    where:{
                        id: String(surveyFid)
                    }
                });
                
                return res.status(200).json(formatResponse(deleteSurveyField,"Success","OK"))
            } catch {
                res.status(500).json({message:"Something went wrong : Could'nt delete survey"})
            }
        }
        
    }
}
    