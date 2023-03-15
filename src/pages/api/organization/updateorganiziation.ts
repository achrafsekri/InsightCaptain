import { NextApiRequest, NextApiResponse } from "next"
import  authOptions  from "../auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { prisma } from "../../../server/db"

export default async function handler(

    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" })
    }
    try {

        const { id, name = null, createdAt = null, updatedAt = null, users = null, invite = null, Survey = null, Poll = null, CaseStudy = null} = req.body
        
        console.log("Organaizaition id : ", id)

         const session = await getServerSession(req, res, authOptions);
           if (!session) {
             res.status(401).json({ message: "You must be logged in." });
             return;
           }

        const updateOrganization = await prisma.organization.update({
        where: {
            id: String(id),
        },
        data: {
            name : name !== null ? name : undefined,
            createdAt : createdAt !== null ? createdAt : undefined,
            updatedAt : updatedAt !== null ? updatedAt : undefined,
            users : users !== null ? users : undefined,
            invite : invite !== null ? invite : undefined,
            Survey : Survey !== null ? Survey : undefined,
            Poll : Poll !== null ? Poll : undefined,
            CaseStudy : CaseStudy !== null ? CaseStudy : undefined,
        },
        })
        console.log(updateOrganization)
        return res.status(200).json(updateOrganization)
    } catch {
        res.status(500).json({ message: " Something went wrong: COULD NOT UPDATE THE ORGANIZIATION " })
    }
    }