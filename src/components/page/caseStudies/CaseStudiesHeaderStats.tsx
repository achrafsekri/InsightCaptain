import React from "react";
import { Card, Metric, Text, Flex, Grid, Title, BarList } from "@tremor/react";
import CaseStudiesTable from "./CaseStudiesTable";
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import { useOrganization } from "../../../Context/OrganizationContext";
import { useQuery } from "@tanstack/react-query";
import { organizationStats } from "../../../lib/apiCalls";

type Stats = {
  totalSurveys: string;
  totalPolls: string;
  totalCaseStudies: string;
  totalResponses: string;
  totalPollsResponses: string;
  totalSurveysResponses: string;
};

const CaseStudiesHeaderStats = () => {
  const { caseStudies } = useCaseStudy();
  const { currentOrganization } = useOrganization();
  const {
    data: statistics,
    isLoading,
    isError,
    error,
    refetch: refetchStats,
  } = useQuery<Stats>(["statistics"], () =>
    organizationStats(currentOrganization.id)
  );
  const categories: {
    title: string | undefined;
    metric: string | undefined;
    metricPrev: string | undefined;
  }[] = [
    {
      title: "CaseStudies",
      metric: caseStudies?.length ? caseStudies.length.toString() : "0",
      metricPrev: statistics?.totalResponses,
    },
    {
      title: "Surveys",
      metric: statistics?.totalSurveys,
      metricPrev: statistics?.totalSurveysResponses,
    },
    {
      title: "Polls",
      metric: statistics?.totalPolls,
      metricPrev: statistics?.totalPollsResponses,
    },
  ];
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <>
        <Grid className="gap-6" numColsSm={2} numColsLg={3}>
          {!isLoading &&
            categories.map((item) => (
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
                    total responses {item.metricPrev}
                  </Text>
                </Flex>
              </Card>
            ))}
        </Grid>

        <div className="mt-6">
          <Card>
            <div className=" overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <CaseStudiesTable />
            </div>
          </Card>
        </div>
      </>
    </main>
  );
};

export default CaseStudiesHeaderStats;
