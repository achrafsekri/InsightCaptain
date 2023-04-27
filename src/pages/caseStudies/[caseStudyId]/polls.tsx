import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import PollTable from "../../../components/page/caseStudies/caseStudyPage/PollTable";

const polls = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <PollTable />
      </main>
    </MainLayout>
  );
};

export default polls;
