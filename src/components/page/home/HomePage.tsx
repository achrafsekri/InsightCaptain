import React from "react";
import { Card, Metric, Text, Flex, Grid, Title, BarList } from "@tremor/react";
import CaseStudiesTable from "../caseStudies/CaseStudiesTable";
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import { useOrganization } from "../../../Context/OrganizationContext";
import { useQuery } from "@tanstack/react-query";
import { organizationStats } from "../../../lib/apiCalls";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

type Stats = {
  totalSurveys: string;
  totalPolls: string;
  totalCaseStudies: string;
  totalResponses: string;
  totalPollsResponses: string;
  totalSurveysResponses: string;
};

const HomePage = () => {
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
    href?: string | undefined;
  }[] = [
    {
      title: "Surveys",
      metric: statistics?.totalSurveys,
      metricPrev: statistics?.totalSurveysResponses,
      href: `/surveys`,
    },
    {
      title: "Polls",
      metric: statistics?.totalPolls,
      metricPrev: statistics?.totalPollsResponses,
      href: `/polls`,
    },
    {
      title: "Case Studies",
      metric: statistics?.totalCaseStudies,
      metricPrev: statistics?.totalCaseStudies,
      href: `/caseStudies`,
    },
  ];
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <>
        <Grid className="mt-6 gap-6" numColsSm={2} numColsLg={3}>
          {categories.map((item) => (
            <Card key={item.title} className="relative">
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
              {item.href && (
                <Link href={item.href}>
                  <MdArrowOutward className=" absolute top-2 right-2 h-6 w-6 text-gray-500" />
                </Link>
              )}
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

export default HomePage;
