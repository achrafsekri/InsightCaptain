import React from "react";
import { Card, Title, Text, Grid } from "@tremor/react";
import MainLayout from "../../../layouts/MainLayout";
import TopAnalytics from "../../../components/page/surveys/TopAnalytics";
import SurveyTable from "../../../components/page/surveys/SurveyTable";
import SurveyKeywords from "../../../components/page/surveys/SurveyKeywords";
import SurveyAnswerTable from "../../../components/page/surveys/SurveyAnswerTable";

const Index = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <TopAnalytics />
        <Card className="mt-6">
          <SurveyAnswerTable />
        </Card>
        <div className="mt-6">
        <SurveyKeywords />
        </div>
      </main>
    </MainLayout>
  );
};

export default Index;
