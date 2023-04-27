import React from "react";
import { Card, Metric, Text, Flex, Grid, Title, BarList } from "@tremor/react";
import CaseStudiesTable from "./CaseStudiesTable";

const categories: {
  title: string;
  metric: string;
  metricPrev: string;
}[] = [
  {
    title: "CaseStudies",
    metric: "6",
    metricPrev: "90,000",
  },
  {
    title: "Surveys",
    metric: "15",
    metricPrev: "15,000",
  },
  {
    title: "Polls",
    metric: "20",
    metricPrev: "75,000",
  },
];

const CaseStudiesHeaderStats = () => {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <>
        <Grid className="gap-6" numColsSm={2} numColsLg={3}>
          {categories.map((item) => (
            <Card key={item.title}>
              <Flex alignItems="start">
                <Text>{item.title}</Text>
              </Flex>
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric>{item.metric}</Metric>
                <Text className="truncate">
                  total respondats {item.metricPrev}
                </Text>
              </Flex>
            </Card>
          ))}
        </Grid>

        <div className="mt-6">
          <Card>
            <div className="h-96 overflow-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <CaseStudiesTable />
            </div>
          </Card>
        </div>
      </>
    </main>
  );
};

export default CaseStudiesHeaderStats;
