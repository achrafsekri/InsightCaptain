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
  getRespondantsChart,
  getRespondantsHistory,
} from "../../../lib/apiCalls";
import { useOrganization } from "../../../Context/OrganizationContext";
import { SurveyChart, SurveysStats } from "../../../types/SurveyPollTypes";
import { useRouter } from "next/router";

const SurveyeesChart = () => {
  const [value, setValue] = useState<DateRangePickerValue>([
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(0, 0, 0, 0)),
    "tdy",
  ]);
  console.log(value);
  const router = useRouter();
  const { surveyId } = router.query;

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch,
  } = useQuery<SurveyChart>(["respondantstats"], () =>
    getRespondantsHistory(surveyId as string, value)
  );
  useEffect(() => {
    refetch();
  }, [value]);

  return (
    <Card>
      <Title>Number of surveyees</Title>
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
            "Number of surveyees": stat[1],
          }))}
          index="date"
          categories={["Number of surveyees"]}
          colors={["blue"]}
          yAxisWidth={40}
        />
      )}
    </Card>
  );
};

export default SurveyeesChart;
