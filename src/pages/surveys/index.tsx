import React from "react";
import { Card, Title, Text, Grid } from "@tremor/react";
import MainLayout from "../../layouts/MainLayout";
import TopAnalytics from "../../components/page/surveys/TopAnalytics";
import SurveyTable from "../../components/page/surveys/SurveyTable";
import SurveyKeywords from "../../components/page/surveys/SurveyKeywords";
import { useOrganization } from "../../Context/OrganizationContext";
import {
  getSurveysByOrganization,
  getSurveysStatics,
} from "../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { Survey } from "@prisma/client";
import { SurveysStats } from "../../types/SurveyPollTypes";

const Index = () => {
  const { currentOrganization } = useOrganization();
  const {
    data: surveys,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey[]>(["surveys"], () =>
    getSurveysByOrganization(String(currentOrganization?.id))
  );

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch: statsRefetch,
  } = useQuery<SurveysStats>(["stats"], () =>
    getSurveysStatics(String(currentOrganization?.id))
  );

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!statsLoading && stats && (
          <TopAnalytics statistics={stats} refetch={statsRefetch} />
        )}
        <Card className="mt-6">
          {!isLoading && <SurveyTable surveys={surveys} />}
        </Card>
        <div className="mt-6">
          <SurveyKeywords />
        </div>
      </main>
    </MainLayout>
  );
};

export default Index;
