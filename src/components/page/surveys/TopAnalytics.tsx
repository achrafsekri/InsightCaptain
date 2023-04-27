import { Card, Title, Text, Grid } from "@tremor/react";
import React from "react";
import SurveyeesChart from "./SurveyeesChart";

const TopAnalytics = () => {
  return (
    <>
      <Title>Surveys</Title>
      <Text>An overview of your surveys</Text>

      {/* Main section */}
      <Card className="mt-6">
        <SurveyeesChart />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
      </Grid>
    </>
  );
};

export default TopAnalytics;
