import React from "react";
import { Card } from "@tremor/react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyKeywords from "../../../components/page/surveys/SurveyKeywords";
import SurveyAnswerTable from "../../../components/page/surveys/SurveyAnswerTable";
import SurveyTopAnalytics from "../../../components/page/surveys/SurveyTopAnalytics";

const Index = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <SurveyTopAnalytics />
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
