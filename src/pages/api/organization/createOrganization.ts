import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { name } = req.body;
    // const session = await getServerSession(req, res, authOptions);
    //   if (!session) {
    //     res.status(401).json({ message: "You must be logged in." });
    //     return;
    //   }
    const addOrganization = await prisma.organization.create({
      data: {
        name,
      },
    });
    console.log(addOrganization);
    return res.status(200).json(addOrganization);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
}
