import { NextApiRequest ,NextApiResponse } from "next"
import { AuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import { prisma } from "../../../server/db"
import { Role } from "@prisma/client"
import User from "@prisma/client"
import {Organization}  from "@prisma/client"
import userOrganization from "@prisma/client"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" })
    }
    try {

     //type requestedRole ={uRole : Role}

     //const { uid, role, uUserId, uOrganizationId, uUser, uOrganization, uJoinedAt } = req.body;

 // const nUser = new userOrganization(uid, role, uUserId, uOrganizationId, uUser, uOrganization, uJoinedAt); 


        const {uid}= req.body;
        const {uRole} /*: requestedRole */= req.body as {uRole: Role};
        const {uUserId}= req.body;
        const {uOrganizationId}= req.body;
        const {uUser}= req.body;
        const {uOrganization}= req.body as {uOrganization: Organization};
        const {uJoinedAt}= req.body;
        

        const newUser = {
            id: uid,
            role: uRole,
            userId: uUserId,
            organizationId: uOrganizationId,
            user: uUser,
            organization: uOrganization,
            joinedAt: uJoinedAt,
        }

        const { id , newUser } = req.body
        
        console.log("Organaizaition id : ", id)
        console.log("User id : ", newUser)

        const addUserToOrg = await prisma.organization.create({
        where: {
            id: String(id),
        },
        data: { 
            users:
            
        },
        })
        console.log(addUserToOrg)
        return res.status(200).json(addUserToOrg)
    } catch {
        res.status(500).json({ message: " Something went wrong: COULD NOT ADD USER TO THE ORGANIZIATION " })
    }
    }