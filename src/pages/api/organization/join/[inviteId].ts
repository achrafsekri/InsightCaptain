import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { invite, type Organization } from "@prisma/client";

type ReqBody = {
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { inviteId } = req.query;
  const { userId } = req.body as ReqBody;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const getInvite = await prisma.invite.findUnique({
      where: {
        invitationCode: inviteId as string,
      },
      include: {
        organization: true,
      },
    });
    if (!getInvite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    const { organization } = getInvite as invite & {
      organization: Organization;
    };
    const addUser = await prisma.userOrganization.create({
      data: {
        userId,
        role: getInvite?.role,
        organizationId: organization.id,
      },
    });
    if (addUser) {
      await prisma.invite.update({
        where: {
          invitationCode: inviteId as string,
        },
        data: {
          joined: true,
          status: "ACCEPTED",
        },
      });
    }
    return res.status(200).json(formatResponse(addUser, "Success", "OK"));
  } catch {
    res.status(500).json(formatResponse(null, "Something went wrong", "500"));
  }
}
