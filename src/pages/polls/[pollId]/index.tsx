import React from "react";
import MainLayout from "../../../layouts/MainLayout";

import PollTopAnalytics from "../../../components/page/polls/PollTopAnalytics";

const Index = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <PollTopAnalytics />
      </main>
    </MainLayout>
  );
};

export default Index;
