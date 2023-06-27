import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../../server/db";
import { formatResponse } from "../../../../../../shared/sharedFunctions";
import type { Poll, Survey } from "@prisma/client";
import { promise } from "zod";
import { baseUrl } from "../../../../../../shared/constants";
import axios from "axios";
import { NumericMonth } from "../../../../../../shared/constants";

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

      const numberOfPollResponses = await prisma.pollAnswer
        .aggregate({
          where: {
            poll: {
              caseStudyId: String(caseStudyId),
            },
          },
          _count: true,
        })
        .catch((err) => {
          console.log(err);
        });

      const numberOfSurveyResponses = await prisma.surveyAnswer
        .aggregate({
          where: {
            survey: {
              caseStudyId: String(caseStudyId),
            },
          },
          _count: true,
        })
        .catch((err) => {
          console.log(err);
        });

      const countriesWithMostResponses = await prisma.surveyAnswer
        .groupBy({
          by: ["location"],
          _count: {
            location: true,
          },
          where: {
            survey: {
              caseStudyId: String(caseStudyId),
            },
          },
        })
        .catch((err) => {
          console.log(err);
        });

      const countryWithMostResponses =
        countriesWithMostResponses.length > 0
          ? countriesWithMostResponses.reduce((prev, current) => {
              return prev._count > current._count ? prev : current;
            })
          : [];

      const surveyResponseChart = await prisma.surveyAnswer.groupBy(
        {
          by: ["createdAtMonth"],
          _count: {
            createdAtMonth: true,
          },
          where: {
            survey: {
              caseStudyId: String(caseStudyId),
            },
          },
        },
        {
          createdAtMonth: {
            orderBy: {
              createdAtMonth: "asc",
            },
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const pollResponseChart = await prisma.pollAnswer.groupBy(
        {
          by: ["createdAtMonth"],
          _count: {
            createdAtMonth: true,
          },
          where: {
            poll: {
              caseStudyId: String(caseStudyId),
            },
          },
        },
        {
          createdAtMonth: {
            orderBy: {
              createdAtMonth: "asc",
            },
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const surveyResponseChartFormatted = surveyResponseChart
        .map((response) => {
          return {
            _count: response._count.createdAtMonth,
            createdAtMonthNumber: response.createdAtMonth,
            createdAtMonth: NumericMonth[response.createdAtMonth],
          };
        })
        .sort((a, b) => a.createdAtMonthNumber - b.createdAtMonthNumber);
      const pollResponseChartFormatted = pollResponseChart
        .map((response) => {
          return {
            _count: response._count.createdAtMonth,
            createdAtMonthNumber: response.createdAtMonth,
            createdAtMonth: NumericMonth[response.createdAtMonth],
          };
        })
        .sort((a, b) => a.createdAtMonthNumber - b.createdAtMonthNumber);

      const getStats = {
        numberOfPolls: getCaseStudy.polls.length,
        numberOfSurveys: getCaseStudy.surveys.length,
        numberOfSurveyResponses: numberOfSurveyResponses._count,
        numberOfPollResponses: numberOfPollResponses._count,
        numberOfResponses:
          numberOfPollResponses._count + numberOfSurveyResponses._count,
        countriesWithMostResponses: countriesWithMostResponses,
        countryWithMostResponses: countryWithMostResponses,
        mostPopularPoll: null,
        mostPopularSurvey: null,
        surveyResponseChart: surveyResponseChartFormatted,
        pollResponseChart: pollResponseChartFormatted,
      };
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
