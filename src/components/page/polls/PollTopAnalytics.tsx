import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { type MouseEvent } from "react";
import SurveyeesChart from "../surveys/SurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import { DocumentDownloadIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import RespondentsChart from "./RespondentsChart";
import PollAnswerBarlist from "./PollAnswerBarlist";

const PollTopAnalytics = () => {
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
          <Title>Poll Title</Title>
          <Text>An overview of your olls</Text>
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
        <RespondentsChart />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          <PollAnswerBarlist />
        </Card>
        <Card>
          <ListChart type="polls" />
        </Card>
      </Grid>
    </>
  );
};

export default PollTopAnalytics;
