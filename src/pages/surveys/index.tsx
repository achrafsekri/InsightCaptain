import React from "react";
import { Card, Title, Text, Grid } from "@tremor/react";
import MainLayout from "../../layouts/MainLayout";
import TopAnalytics from "../../components/page/surveys/TopAnalytics";

const Index = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <TopAnalytics />
      </main>
    </MainLayout>
  );
};

export default Index;
