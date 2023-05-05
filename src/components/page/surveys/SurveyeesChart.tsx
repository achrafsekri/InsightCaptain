import {
  Card,
  Title,
  LineChart,
  DateRangePicker,
  type DateRangePickerValue,
} from "@tremor/react";
import { es } from "date-fns/locale";
import React, { useState } from "react";

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
    new Date(2022, 1, 1),
    new Date(),
  ]);
  console.log(value);
  return (
    <Card>
      <Title>Number of surveyees</Title>
      <DateRangePicker
        className="mx-auto max-w-md"
        value={value}
        onValueChange={setValue}
        locale={es}
        dropdownPlaceholder="Seleccionar"
      />
      <LineChart
        className="mt-6"
        data={chartdata}
        index="date"
        categories={["Number of surveyees"]}
        colors={["blue"]}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default SurveyeesChart;
