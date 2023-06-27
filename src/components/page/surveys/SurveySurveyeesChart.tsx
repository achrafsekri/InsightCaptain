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
import { getRespondantsChart } from "../../../lib/apiCalls";
import { useOrganization } from "../../../Context/OrganizationContext";
import { SurveyChart, SurveysStats } from "../../../types/SurveyPollTypes";

const chartdata = [
  {
    date: "Jan 9",
    "Number of surveyees": 24,
  },
  {
    date: "Jan 20",
    "Number of surveyees": 35,
  },
  {
    date: "Jan 21",
    "Number of surveyees": 254,
  },
  {
    date: "Jan 25",
    "Number of surveyees": 12,
  },
  {
    date: "Jan 26",
    "Number of surveyees": 120,
  },
];

const SurveyeesChart = () => {
  const [value, setValue] = useState<DateRangePickerValue>([
    () => {
      const date = new Date();
      date.setDate(date.getDate() );
      return date.toISOString();
    },
    new Date(),
    "tdy",
  ]);
  const { currentOrganization } = useOrganization();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch,
  } = useQuery<SurveyChart>(["respondantstats"], () =>
    getRespondantsChart(String(currentOrganization?.id), value)
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
