import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

type Body = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getServerSession(req, res, authOptions);
  //   if (!session) {
  //     res.status(401).json({ message: "You must be logged in." });
  //     return;
  //   }
  if (req.method === "GET") {
    try {
      const { organisationId } = req.query;
      const invitations = await prisma.invite.findMany({
        where: {
          organizationId: String(organisationId),
        },
      });
      if (!invitations) {
        return res.status(404).json({ message: "Organization not found" });
      }

      return res
        .status(200)
        .json(formatResponse(invitations, "Success", "OK"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  }
}
