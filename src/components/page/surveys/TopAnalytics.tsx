import { Card, Title, Text, Grid } from "@tremor/react";
import React from "react";
import SurveyeesChart from "./SurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";

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
          <ListChart type="surveys" />
        </Card>
        <Card>
          <AgeGroupListChart type="surveys" />
        </Card>
      </Grid>
    </>
  );
};

export default TopAnalytics;
