import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

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
    return res
      .status(200)
      .json(formatResponse(addOrganization, "Success", "OK"));
  } catch {
    res.status(500).json(formatResponse(null, "Something went wrong", "500"));
  }
}
