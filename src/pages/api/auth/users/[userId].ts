import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;
    console.log(userId)
    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
      include: {
        organizations: true,
      },
    }) 
console.log(user)
    if (!user) {
      res.status(404).json(formatResponse(null, "User not found", "404"));
      return;
    }
    res.status(200).json(formatResponse(user, "User found", "200"));
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
