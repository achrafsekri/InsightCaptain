import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { Poll } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { caseStudyId } = req.query;
      const polls= await prisma.poll.findMany({
        where: {
          caseStudyId: caseStudyId as string,
        },
        include: {
          options: {
            include: {
              PollAnswers: true,
            },
          },
        },
      });

      if (!polls) {
        res.status(400).json(formatResponse(null, "Polls not found", "400"));
      } else {
        polls.map((poll) => {
          poll.options.map((option) => {
            option.votes = option.PollAnswers.length;
          });
          poll.totalVotes = poll.options.reduce(
            (acc, option) => acc + option.votes,
            0
          );
        });

        res
          .status(200)
          .json(formatResponse(polls, "Polls fetched successfully", "200"));
      }
    } catch (err) {
      console.error(err);
      res.status(400).json(formatResponse(null, "error fetching polls", "400"));
    }
  }
}
