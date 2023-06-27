import React from "react";
import { Card } from "@tremor/react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyKeywords from "../../../components/page/surveys/SurveyKeywords";
import SurveyAnswerTable from "../../../components/page/surveys/SurveyAnswerTable";
import SurveyTopAnalytics from "../../../components/page/surveys/SurveyTopAnalytics";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  getSurvey,
  getSurveyAnswers,
  getSurveyStats,
} from "../../../lib/apiCalls";
import { Survey } from "@prisma/client";

const Index = () => {
  const router = useRouter();
  const { surveyId } = router.query;
  const {
    data: survey,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey>(["survey"], () => getSurvey(String(surveyId)));

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch: statsRefetch,
  } = useQuery(["stats"], () => getSurveyStats(String(surveyId)));
  const {
    data: answers,
    isLoading: answersLoading,
    isError: answersIsError,
    error: answersError,
    refetch: answersRefetch,
  } = useQuery(["answers"], () => getSurveyAnswers(String(surveyId)));
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <SurveyTopAnalytics data={stats} survey={survey} />
        <Card className="mt-6">
          {!answersLoading && <SurveyAnswerTable data={answers} />}
          {answersLoading && <div>Loading...</div>}
          {answersIsError && <div>answersError</div>}
        </Card>
        <div className="mt-6">
          <SurveyKeywords />
        </div>
      </main>
    </MainLayout>
  );
};

export default Index;
