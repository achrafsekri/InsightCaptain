import { NextApiRequest,NextApiResponse } from "next";
// import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";


export default async function handler(

    req: NextApiRequest,
    res: NextApiResponse
    
) {
    

    if(req.method === "GET"){
        try {
            const { surveyId } = req.query;
            const getSurvey = await prisma.survey.findUnique({

                where:{
                    id: String(surveyId)
                },
                select:{
                    id: true,
                    title: true,
                    description: true,
                }
            });
        if(!getSurvey) {
        return res.status(404).json(formatResponse(null,"Survey not found","NOT_FOUND"));}
            
            return res.status(200).json(formatResponse(getSurvey,"Success","OK"));
        } catch {
            res.status(500).json({message:"Something went wrong"})
        }
    }else{ 


        if(req.method === "PATCH"){
            try{

                const { surveyId } = req.query;
                const { title , description } = req.body;
                const { organizationId } = req.query;
                const { caseStudyId } = req.query;

                const updateSurvey = await prisma.survey.update({

                    where:{

                        id: String(surveyId)
                    },
                    data:{

                        title: String(title),
                        description: String(description),
                        organizationId: String(organizationId),
                        caseStudyId: String(caseStudyId),
                        updatedAt: new Date()

                    },   
                });
                
               
                return res.status(200).json(formatResponse(updateSurvey,"Success","OK"))
            }catch{
                res.status(500).json({message:"Something went wrong : Could'nt update survey"})
            }
        }


        if(req.method === "DELETE"){
            try{

                const { surveyId } = req.query;

                const deleteSurvey = await prisma.survey.delete({

                    where:{

                        id: String(surveyId)

                    }
                });
                
                return res.status(200).json(formatResponse(deleteSurvey,"Success","OK"))
            } catch {
                res.status(500).json({message:"Something went wrong : Could'nt delete survey"})
            }
        }
        
    }
}
    