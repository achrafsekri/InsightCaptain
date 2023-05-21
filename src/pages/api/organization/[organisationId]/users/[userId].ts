import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import { type Role } from "@prisma/client";


type Body = {
  role: Role;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organisationId: organizationId, userId } = req.query;
  if (req.method === "POST") {
    try {
      const addUser = await prisma.userOrganization.create({
        data: {
          user: {
            connect: {
              id: String(userId),
            },
          },
          organization: {
            connect: {
              id: String(organizationId),
            },
          },
        },
      });
      return res.status(200).json(formatResponse(addUser, "Success", "OK"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
  if (req.method === "DELETE") {
    try {
      // remove user from organization
      const removeUser = await prisma.userOrganization.deleteMany({
        where: {
          userId: String(userId),
          organizationId: String(organizationId),
        },
      });

      console.log(removeUser);
      return res
        .status(200)
        .json(formatResponse("User removed successefuly ", "Success", "OK"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }

  if (req.method === "PATCH") {
    try {
      const { role } = req.body as Body;
      const updateRole = await prisma.userOrganization.updateMany({
        where: {
          userId: String(userId),
          organizationId: String(organizationId),
        },
        data: {
          role: role,
        },
      });
      return res.status(200).json(formatResponse(updateRole, "Success", "OK"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
}
