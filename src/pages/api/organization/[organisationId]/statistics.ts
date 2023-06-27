import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";

type Analytics = {
  totalResponses: number;
  totalSurveys: number;
  totalPolls: number;
  totalCaseStudies: number;
  totalPollsResponses: number;
  totalSurveysResponses: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { organisationId: organizationId } = req.query;
    const totalCaseStudies = await prisma.caseStudy.aggregate({
      where: {
        organizationId: organizationId as string,
      },
      _count: true,
    });
    const totalPolls = await prisma.poll.aggregate({
      where: {
        organizationId: organizationId as string,
      },
      _count: true,
    });
    const totalSurveys = await prisma.survey.aggregate({
      where: {
        organizationId: organizationId as string,
      },
      _count: true,
    });

    const totalSurveyResponses = await prisma.surveyAnswer.aggregate({
      where: {
        survey: {
          organizationId: organizationId as string,
        },
      },
      _count: true,
    });
    const totalPollResponses = await prisma.pollAnswer.aggregate({
      where: {
        poll: {
          organizationId: organizationId as string,
        },
      },
      _count: true,
    });
    const analytics: Analytics = {
      totalCaseStudies: totalCaseStudies._count,
      totalPolls: totalPolls._count,
      totalSurveys: totalSurveys._count,
      totalResponses: totalPollResponses._count + totalSurveyResponses._count,
      totalPollsResponses: totalPollResponses._count,
      totalSurveysResponses: totalSurveyResponses._count,
    };
    return res.status(200).json(formatResponse(analytics, "Success", "200"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(formatResponse(null, "Server error", "500"));
  }
}
