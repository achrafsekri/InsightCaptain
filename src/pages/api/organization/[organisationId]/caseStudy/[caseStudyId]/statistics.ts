import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../../server/db";
import { formatResponse } from "../../../../../../shared/sharedFunctions";
import type { Poll, Survey } from "@prisma/client";
import { promise } from "zod";
import { baseUrl } from "../../../../../../shared/constants";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { organisationId, caseStudyId } = req.query;
      const getCaseStudy = await prisma.caseStudy.findUnique({
        where: {
          id: String(caseStudyId),
        },
        include: {
          polls: true,
          surveys: true,
        },
      });
      if (!getCaseStudy) {
        return res
          .status(404)
          .json(formatResponse(null, "Case study not found", "404"));
      }

      const getStats = {
        numberOfPolls: getCaseStudy.polls.length,
        numberOfSurveys: getCaseStudy.surveys.length,
        mostPopularPoll: null,
        mostPopularSurvey: null,
      };

      const getPollStats = await Promise.all(
        getCaseStudy.polls.map(async (poll) => {
          const pollStats = await axios.get(
            `${baseUrl}/api/poll/${poll.id}/statistics`
          );

          console.log("pollStats", pollStats);
          return pollStats;
        })
      );
      console.log(getPollStats);
      return res
        .status(200)
        .json(formatResponse(getStats, "Poll stats", "200"));
    } catch (err) {
      return res
        .status(500)
        .json(formatResponse(null, " error getting stats", "500"));
    }
  }
}
