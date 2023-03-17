import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

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
      res.status(500).json({ message: "Something went wrong" });
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
      res.status(500).json({
        message: "Something went wrong removing the user from the organization",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { role } = req.body;
      const newRole = role.toUpperCase();
      console.log(newRole);
      const updateRole = await prisma.userOrganization.updateMany({
        where: {
          userId: String(userId),
          organizationId: String(organizationId),
        },
        data: {
          role:newRole,
        },
      });
      return res.status(200).json(formatResponse(updateRole, "Success", "OK"));
    } catch {
      res
        .status(500)
        .json({ message: "Something went wrong updating the user's role" });
    }
  }
}
