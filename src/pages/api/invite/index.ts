import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type Body = {
  email: string;
  organizationId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, organizationId } = req.body as Body;

      const createInvite = await prisma.invite.create({
        data: {
          email: String(email),
          organization: {
            connect: {
              id: String(organizationId),
            },
          },
        },
      });
      return res
        .status(200)
        .json(formatResponse(createInvite, "Success", "OK"));
    } catch {
      res
        .status(500)
        .json({ message: "Something went wrong : Could not create invite" });
    }
  }
}
