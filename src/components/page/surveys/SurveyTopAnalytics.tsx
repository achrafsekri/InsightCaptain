import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { type MouseEvent } from "react";
import SurveyeesChart from "./SurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import { DocumentDownloadIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import SurveySentimentChart from "./SurveySentimentChart";
import { type Survey } from "@prisma/client";
import Keywords from "../../global/Keywords";

type props = {
  data: any;
  survey: Survey;
};

const SurveyTopAnalytics = ({ data, survey }: props) => {
  const router = useRouter();
  const { surveyId } = router.query;
  const handleEdit = (): void => {
    router.push(`/surveys/${surveyId as string}/edit`).catch((err) => {
      console.error(err);
    });
  };
  return (
    <>
      <Flex className="justify-between">
        <div>
          <Title>{survey?.title}</Title>
          <Text>Mange and get insights and statistics about your survey</Text>
        </div>
        <div>
          <Button
            icon={PencilAltIcon}
            className="mt-4 ml-2"
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>
      </Flex>

      {/* Main section */}
      <Card className="mt-6">
        <SurveyeesChart />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          <ListChart
            type="surveys"
            data={data?.countriesWithMostResponses}
            countryWithMostResponses={data?.countryWithMostResponses}
          />
        </Card>
        <Card>
          <AgeGroupListChart type="surveys" data={data?.ageGroupsData} />
        </Card>
      </Grid>
      <Card className="mt-6">
        <SurveySentimentChart sentimentData={data?.sentiments} />
      </Card>
    </>
  );
};

export default SurveyTopAnalytics;
