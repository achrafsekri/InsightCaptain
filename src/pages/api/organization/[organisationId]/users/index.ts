import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";

//get users by organization

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  // if (!session) {
  //   res.status(401).json({ message: "You must be logged in." });
  //   return;
  // }
  if (req.method === "GET") {
    try {
      const { organisationId } = req.query;
      const users = await prisma.userOrganization.findMany({
        where: {
          organizationId: String(organisationId),
        },
        select: {
          user: true,
          role: true,
        },
      });
      //by users ids get the user data

      if (!users) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res.status(200).json(formatResponse(users, "Success", "OK"));
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
