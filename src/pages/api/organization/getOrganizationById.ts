import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { id } = req.query;
    // const session = await getServerSession(req, res, authOptions);
    //   if (!session) {
    //     res.status(401).json({ message: "You must be logged in." });
    //     return;
    //   }
    const getOrganization = await prisma.organization.findMany();
    console.log("getOrganization", getOrganization);
    return res.status(200).json(getOrganization);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
}
