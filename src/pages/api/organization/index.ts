import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type ReqBody = {
  name: string;
  image: string;
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { name, image, userId } = req.body as ReqBody;
    // const session = await getServerSession(req, res, authOptions);
    //   if (!session) {
    //     res.status(401).json({ message: "You must be logged in." });
    //     return;
    //   }
    const addOrganization = await prisma.organization.create({
      data: {
        name,
        image,
      },
    });
    addOrganization &&
      (await prisma.userOrganization.create({
        data: {
          userId,
          role: "OWNER",
          organizationId: addOrganization.id,
        },
      }));
    return res
      .status(200)
      .json(formatResponse(addOrganization, "Success", "OK"));
  } catch {
    res.status(500).json(formatResponse(null, "Something went wrong", "500"));
  }
}
