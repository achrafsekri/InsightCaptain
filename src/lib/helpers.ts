import { type SurveyFeild } from "@prisma/client";
import { type SurveyPollChart } from "../types/SurveyPollTypes";

export const reorder = (
  list: SurveyFeild[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed !== undefined) {
    result.splice(endIndex, 0, removed);
  }

  return result;
};

export const formatPerformanceData = (
  pollData: SurveyPollChart[],
  surveyData: SurveyPollChart[]
) => {
  const Months = [
    {
      month: "Jan",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Feb",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Mar",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Apr",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "May",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Jun",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Jul",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Aug",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Sep",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Oct",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Nov",
      Polls: 0,
      Surveys: 0,
    },
    {
      month: "Dec",
      Polls: 0,
      Surveys: 0,
    },
  ];
  const performanceData = Months.map((month) => {
    const pollResponse = pollData.find(
      (poll) => poll.createdAtMonth === month.month
    );
    const surveyResponse = surveyData.find(
      (survey) => survey.createdAtMonth === month.month
    );
    if (pollResponse) {
      month.Polls = pollResponse._count;
    }
    if (surveyResponse) {
      month.Surveys = surveyResponse._count;
    }
    return month;
  });
  return performanceData;
};

export function findMaxAgeGroup(
  ageGroupsData: { name: string; value: number }[]
) {
  let maxGroup = null;
  let maxValue = -Infinity;

  for (let i = 0; i < ageGroupsData?.length; i++) {
    const group = ageGroupsData[i];
    if (group.value > maxValue) {
      maxGroup = group.name;
      maxValue = group.value;
    }
  }

  return {
    name: maxGroup,
    value: maxValue,
  } as { name: string; value: number; persantage: number };
}
