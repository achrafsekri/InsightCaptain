import React from "react";
import { Card, Metric, Text, Flex, Grid, Title } from "@tremor/react";
import Countries from "./Countries";
import Performance from "./Performance";
import { MdArrowOutward } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
import Keywords from "../../../global/Keywords";
import { useCaseStudy } from "../../../../Context/CaseStudyContext";
import { useOrganization } from "../../../../Context/OrganizationContext";
import { getCaseStudyStats } from "../../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../global/Loading";

export type CountryWithMostResponses = {
  location: string;
  _count: {
    location: number;
  };
};

export type ChartData = {
  _count: {
    createdAt: string;
  };
  createdAt: string;
};

type Stats = {
  numberOfPolls: string;
  numberOfSurveys: string;
  numberOfResponses: string;
  numberOfSurveyResponses: string;
  numberOfPollResponses: string;
  countryWithMostResponses: CountryWithMostResponses;
  countriesWithMostResponses: CountryWithMostResponses[];
  surveyResponseChart: ChartData[];
  pollResponseChart: ChartData[];
  mostPopularPoll: string;
  mostPopularSurvey: string;
};

const CaseStudyAnalytics = () => {
  const route = useRouter();
  const { caseStudyId } = route.query;
  const { caseStudies } = useCaseStudy();
  const caseStudy = caseStudies?.find((item) => item.id === caseStudyId);
  const { currentOrganization } = useOrganization();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Stats>(["stats"], () =>
    getCaseStudyStats(caseStudy?.id, currentOrganization.id)
  );

  const categories: {
    title: string | undefined;
    metric: string | undefined;
    metricPrev: string | undefined;
    href?: string | undefined;
  }[] = [
    {
      title: "Surveys",
      metric: stats?.numberOfSurveys,
      metricPrev: stats?.numberOfSurveyResponses,
      href: `/caseStudies/${caseStudyId as string}/surveys`,
    },
    {
      title: "Polls",
      metric: stats?.numberOfPolls,
      metricPrev: stats?.numberOfPollResponses,
      href: `/caseStudies/${caseStudyId as string}/polls`,
    },
    {
      title: "Country with most responses",
      metric: stats?.countryWithMostResponses?.location
        ? stats?.countryWithMostResponses?.location
        : "No responses yet",
      metricPrev: stats?.countryWithMostResponses._count?.location?.toString()
        ? stats?.countryWithMostResponses._count?.location?.toString()
        : "No responses yet",
    },
  ];
  if (isError) {
    return (
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        An error just occured please reload the page in a bit ...
      </main>
    );
  }
  if (isLoading) {
    return <main className="mx-auto max-w-7xl p-4 md:p-10">Loading ...</main>;
  }
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      {!isLoading && (
        <>
          <Title>{caseStudy?.title}</Title>
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
            <Grid numColsSm={2} numColsLg={2} className="gap-6">
              <Countries data={stats?.countriesWithMostResponses} />
              <Performance
                pollsData={stats?.pollResponseChart}
                surveysData={stats?.surveyResponseChart}
              />
            </Grid>
          </div>
          <div className="mt-6">
            <Keywords />
          </div>
          {/* <div className="mt-6">
          <Card>
            <div className="h-96 overflow-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <CaseStudiesTable />
            </div>
          </Card>
        </div> */}
        </>
      )}
    </main>
  );
};

export default CaseStudyAnalytics;
