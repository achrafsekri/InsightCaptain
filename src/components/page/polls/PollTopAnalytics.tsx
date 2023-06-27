import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { type MouseEvent } from "react";
import SurveyeesChart from "../surveys/SurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import { DocumentDownloadIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import RespondentsChart from "./RespondentsChart";
import PollAnswerBarlist from "./PollAnswerBarlist";
import { Poll } from "@prisma/client";
import { getPollStats } from "../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";

type Props = {
  data: Poll;
};

const PollTopAnalytics = ({ data }: Props) => {
  const router = useRouter();
  const { pollId } = router.query;

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["stats"], () => getPollStats(String(pollId)));

  const handleEdit = (): void => {
    router.push(`/polls/${pollId as string}/edit`).catch((err) => {
      console.error(err);
    });
  };
  return (
    <>
      <Flex className="justify-between">
        <div>
          <Title className="capitalize">{data.title}</Title>
          <Text>An overview of your poll statistics and insights</Text>
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
      {!isLoading && !isError && (
        <Card className="mt-6">
          <RespondentsChart type="poll" />
        </Card>
      )}

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>{!isLoading && !isError && <PollAnswerBarlist data={data.options} />}</Card>
        <Card>
          {!isLoading && !isError && (
            <ListChart
              type="polls"
              countryWithMostResponses={stats.countriesWithMostResponses[0]}
              data={stats.countriesWithMostResponses}
            />
          )}
        </Card>
      </Grid>
    </>
  );
};

export default PollTopAnalytics;
