import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { type MouseEvent } from "react";
import SurveyeesChart from "./SurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import { DocumentDownloadIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const TopAnalytics = () => {
  const router = useRouter();
  const handleEdit = (): void => {
    router.push("/surveys/[surveyId]/edit", "/surveys/1/edit").catch((err) => {
      console.error(err);
    });
  };
  return (
    <>
      <Flex className="justify-between">
        <div>
          <Title>Survey Title</Title>
          <Text>An overview of your surveys</Text>
        </div>
        <div>
          <Button icon={DocumentDownloadIcon} className="mt-4">
            Export
          </Button>
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
