import React from "react";
import { Card, Title } from "@tremor/react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyKeywords from "../../../components/page/surveys/SurveyKeywords";
import SurveyAnswerTable from "../../../components/page/surveys/SurveyAnswerTable";
import SurveyTopAnalytics from "../../../components/page/surveys/SurveyTopAnalytics";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  getSurvey,
  getSurveyAnswers,
  getSurveyKeywords,
  getSurveyStats,
} from "../../../lib/apiCalls";
import { Survey } from "@prisma/client";
import { Skeleton } from "primereact/skeleton";

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
  const {
    data: Keywords,
    isLoading: KeywordsLoading,
    isError: KeywordsIsError,
    error: KeywordsError,
    refetch: KeywordsRefetch,
  } = useQuery(["Keywords"], () => getSurveyKeywords(String(surveyId)));
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {/* {isLoading && (
          <Card className="mt-6">
            <Skeleton height="150px" />
          </Card>
        )} */}
        <SurveyTopAnalytics data={stats} survey={survey} />

        <Card className="mt-6">
          {!answersLoading && <SurveyAnswerTable data={answers} />}
          {answersLoading && (
            <Card className="mt-6">
              <Skeleton height="150px" />
            </Card>
          )}
          {answersIsError && <div>answersError</div>}
        </Card>
        <div className="mt-6">
          {!KeywordsLoading && !KeywordsIsError && Keywords && (
            <SurveyKeywords keywords={Keywords} />
          )}
          {KeywordsLoading && (
            <Card className="mt-6">
              <Title className="mb-4">Keywords</Title>
              <Skeleton height="150px" />
            </Card>
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default Index;
