import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../../server/db";
import { formatResponse } from "../../../../../../shared/sharedFunctions";
import type { Poll, Survey } from "@prisma/client";

type caseStudyStats = {
  numberOfPolls: number;
  numberOfSurveys: number;
  numberOfPollResponses: number;
  numberOfSurveyResponses: number;
  mostPopularPoll: Poll;
  mostPopularSurvey: Survey;
};

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

     

      const getStats: caseStudyStats = {
        numberOfPolls: getCaseStudy.polls.length,
        numberOfSurveys: getCaseStudy.surveys.length,
        numberOfPollResponses: 0,
        numberOfSurveyResponses: 0,
        mostPopularPoll: null,
        mostPopularSurvey: null,
      };

      return res
        .status(200)
        .json(formatResponse(getStats, "Poll stats", "200"));
    } catch (err) {
      return res.status(500).json(formatResponse(null, err.message, "500"));
    }
  }
}
