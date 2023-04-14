import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { Poll, PollAnswer } from "@prisma/client";

type stats = {
  totalResponses?: number;
  totalOptions?: number;
  locationwithmostresponses?: string;
};

type locationwithmostresponses = {
  [key: string]: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { pollId } = req.query;
      const getPoll = await prisma.poll.findUnique({
        where: {
          id: String(pollId),
        },
        include: {
          options: true,
        },
      });
      if (!getPoll) {
        return res
          .status(404)
          .json(formatResponse(null, "Poll not found", "404"));
      }

      const getStats: stats = {};
      const getResponses: PollAnswer[] = await prisma.pollAnswer.findMany({
        where: {
          pollId: String(pollId),
        },
        include: {
          pickedOption: true,
        },
      });

      getStats.totalResponses = getResponses.length;
      getStats.totalOptions = getPoll.options.length;
      const locationwithmostresponses: locationwithmostresponses =
        getResponses.reduce((acc, curr) => {
          if (curr.location === null) return acc;
          if (acc[curr.location]) {
            acc[curr.location] += 1;
          } else {
            acc[curr.location] = 1;
          }
          return acc;
        }, {} as { [key: string]: number });
      locationwithmostresponses["null"] = 0; // if no location is provided
      getStats.locationwithmostresponses = Object.keys(
        locationwithmostresponses
      ).reduce((a, b) =>
        locationwithmostresponses[a] > locationwithmostresponses[b] ? a : b
      );

      return res
        .status(200)
        .json(formatResponse(getStats, "Statistics fetched", "200"));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(null, "Internal server error", "500"));
    }
  } else {
    return res
      .status(405)
      .json(formatResponse(null, "Method not allowed", "405"));
  }
}
