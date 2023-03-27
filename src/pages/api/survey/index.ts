import { NextApiRequest,NextApiResponse } from "next";
// import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";




export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method === "POST")
    {
        try {

            const { title, description } = req.body;
            const { organizationId } = req.query;
            const { caseStudyId } = req.query;

            //const { surveyFields }: { surveyFields: SurveyFeild[] } = req.body;

            const createSurvey = await prisma.survey.create({
               
                data: {

                    title: String(title),
                    description: String(description),

                    organization: {
                      connect: {
                        id: String(organizationId),
                      },
                    },

                      caseStudy: {
                        connect: {
                          id: String(caseStudyId),
                        },  
                      },
                    
                }
            })
            return res.status(200).json(formatResponse(createSurvey,"Success","OK"))
            
        } catch {
            res.status(500).json({message:"Something went wrong : Could not create survey"})
        }
    }
  
}

