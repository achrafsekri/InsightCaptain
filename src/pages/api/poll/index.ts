// create poll
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type expectedBody = {
  title: string;
  caseStudyId: string;
  organizationId: string;
  pollOptions: {
    title: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, caseStudyId, organizationId, pollOptions } =
      req.body as expectedBody;

    console.log(req.body);

    const poll = await prisma.poll.create({
      data: {
        options: {
          create: pollOptions,
        },
        title,
        caseStudy: {
          connect: {
            id: caseStudyId,
          },
        },
        organization: {
          connect: {
            id: organizationId,
          },
        },
      },
    });

    res
      .status(200)
      .json(formatResponse(poll, "Poll created successfully", "200"));
  } else {
    res.status(405).json(formatResponse(null, "Method not allowed", "405"));
  }
}
