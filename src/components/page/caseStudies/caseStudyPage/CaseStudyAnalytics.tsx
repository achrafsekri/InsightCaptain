import React from "react";
import {
  Card,
  Metric,
  Text,
  Flex,
  Grid,
  Title,
  BarList,
  Bold,
  List,
  ListItem,
  BadgeDelta,
} from "@tremor/react";
import Countries from "./Countries";
import Performance from "./Performance";
import { MdArrowOutward } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
import Keywords from "./Keywords";

const CaseStudyAnalytics = () => {
  const route = useRouter();
  const categories: {
    title: string;
    metric: string;
    metricPrev: string;
    href?: string | undefined;
  }[] = [
    {
      title: "Surveys",
      metric: "15",
      metricPrev: "15,000",
      href: `/caseStudies/${route.query.caseStudyId}/surveys`,
    },
    {
      title: "Polls",
      metric: "20",
      metricPrev: "75,000",
      href: `/caseStudies/${route.query.caseStudyId}/polls`,
    },
    {
      title: "Country with most responses",
      metric: "Tunisia",
      metricPrev: "90,000",
    },
  ];
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <>
        <Title>New Product Case study</Title>
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
                  total respondats {item.metricPrev}
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
            <Countries />
            <Performance />
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
    </main>
  );
};

export default CaseStudyAnalytics;
