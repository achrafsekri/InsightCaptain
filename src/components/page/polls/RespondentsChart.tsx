import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Title,
  LineChart,
  DateRangePicker,
  type DateRangePickerValue,
} from "@tremor/react";
import { es } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import {
  getPollsRespondantsHistory,
  getPollRespondantsHistory
} from "../../../lib/apiCalls";
import { useOrganization } from "../../../Context/OrganizationContext";
import { type SurveyChart } from "../../../types/SurveyPollTypes";
import { useRouter } from "next/router";

const RespondentsChart = ({ type }) => {
  const getDate = () => {
    const date = new Date();
    date.setDate(date.getDate());
    return date.toISOString();
  };
  const [value, setValue] = useState<DateRangePickerValue>([
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(0, 0, 0, 0)),
    "tdy",
  ]);
  console.log(value);
  const router = useRouter();
  const { pollId } = router.query;
  const { currentOrganization } = useOrganization();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch,
  } = useQuery<SurveyChart>(["respondantstats"], () =>
    type !== "poll"
      ? getPollsRespondantsHistory(currentOrganization.id, value)
      : getPollRespondantsHistory(pollId, value)
  );
  useEffect(() => {
    refetch();
  }, [value]);

  return (
    <Card>
      <Title>Number of poll votes</Title>
      <DateRangePicker
        className="mx-auto max-w-md"
        value={value}
        onValueChange={(value) => {
          setValue(value);
          console.log(value);
          refetch();
        }}
        locale={es}
        dropdownPlaceholder="Select a date range"
      />
      {!statsLoading && stats && (
        <LineChart
          className="mt-6"
          data={stats.map((stat) => ({
            date: stat[0],
            "Number of votes": stat[1],
          }))}
          index="date"
          categories={["Number of votes"]}
          colors={["blue"]}
          yAxisWidth={40}
        />
      )}
    </Card>
  );
};

export default RespondentsChart;
