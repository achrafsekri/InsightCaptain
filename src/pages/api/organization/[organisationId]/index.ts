import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

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
      console.log(req.query);
      const getOrganization = await prisma.organization.findUnique({
        where: {
          id: String(organisationId),
        },
      });
      if (!getOrganization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res
        .status(200)
        .json(formatResponse(getOrganization, "Success", "OK"));
    } catch {
      res.status(500).json(formatResponse(null, "Something went wrong", "500"));
    }
  } else {
    if (req.method === "PATCH") {
      try {
        const { organisationId } = req.query;
        const { name } = req.body;
        const updateOrganization = await prisma.organization.update({
          where: {
            id: String(organisationId),
          },
          data: {
            name,
          },
        });
        return res
          .status(200)
          .json(formatResponse(updateOrganization, "Success", "OK"));
      } catch {
        res
          .status(500)
          .json(formatResponse(null, "Something went wrong", "500"));
      }
    }
    if (req.method === "DELETE") {
      try {
        const { organisationId } = req.query;
        const deleteOrganization = await prisma.organization.delete({
          where: {
            id: String(organisationId),
          },
        });
        return res.status(200).json("Organization deleted successfully!");
      } catch {
        res
          .status(500)
          .json(formatResponse(null, "Something went wrong", "500"));
      }
    }
  }
}
