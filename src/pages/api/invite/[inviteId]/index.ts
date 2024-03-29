import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

type Body = {
  email?: string;
  role?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { inviteId } = req.query;

      const invite = await prisma.invite.findUnique({
        where: {
          id: String(inviteId),
        },
        select: {
          id: true,
          email: true,
          status: true,
          joined: true,
          role: true,
        },
      });

      if (!invite) {
        console.log(invite);
        return res
          .status(404)
          .json(formatResponse(null, "Invite not found", "NOT_FOUND"));
      } else {
        console.log("  THE Invite  ", invite);
        return res.status(200).json(formatResponse(invite, "Success", "OK"));
      }
    } catch {
      res
        .status(500)
        .json({ message: "Something went wrong : Could not get invite" });
    }
  } else {
    if (req.method === "PATCH") {
      try {
        const { inviteId } = req.query;
        const { email } = req.body as Body;

        const updateInvite = await prisma.invite.update({
          where: {
            id: String(inviteId),
          },
          data: {
            email: String(email),
          },
        });

        return res
          .status(200)
          .json(formatResponse(updateInvite, "Success", "OK"));
      } catch {
        res
          .status(500)
          .json({ message: "Something went wrong : Could not update invite" });
      }
    }

    if (req.method === "DELETE") {
      try {
        const { inviteId } = req.query;

        const deleteInvite = await prisma.invite.delete({
          where: {
            id: String(inviteId),
          },
        });

        return res
          .status(200)
          .json(formatResponse(deleteInvite, "Success", "200"));
      } catch {
        res
          .status(500)
          .json({ message: "Something went wrong : Could not delete invite" });
      }
    }
  }
}
