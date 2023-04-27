import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyTable from "../../../components/page/caseStudies/caseStudyPage/SurveyTable";

const surveys = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <SurveyTable />
      </main>
    </MainLayout>
  );
};

export default surveys;
