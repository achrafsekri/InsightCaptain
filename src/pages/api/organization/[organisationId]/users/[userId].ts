import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { organisationId, userId } = req.query;
      console.log("organisationId", organisationId);
      console.log("userId", userId);
      const addUser = await prisma.userOrganization.create({
        data: {
          user: {
            connect: {
              id: String(userId),
            },
          },
          organization: {
            connect: {
              id: String(organisationId),
            },
          },
        },
      });
      return res.status(200).json(formatResponse(addUser, "Success", "OK"));
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
