import { type CountryWithMostResponses } from "../components/page/caseStudies/caseStudyPage/CaseStudyAnalytics";

export type SurveyPollChart = {
  _count: number;
  createdAtMonthNumber: number;
  createdAtMonth: string;
};

export type SurveysStats = {
  countriesWithMostResponses: CountryWithMostResponses[];
  respondantsByDate: [];
  CountryWithMostResponses: CountryWithMostResponses[];
  ageGroupsData: {
    name: string;
    value: number;
    persantage: number;
  }[];
};

export type SurveyChart = {
  data: [string, string][];
};

