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
    "Number of respondents": 24,
  },
  {
    date: "Jan 20",
    "Number of respondents": 35,
  },
  {
    date: "Jan 21",
    "Number of respondents": 254,
  },
  {
    date: "Jan 25",
    "Number of respondents": 12,
  },
  {
    date: "Jan 26",
    "Number of respondents": 120,
  },
];

const RespondentsChart = () => {
  const [value, setValue] = useState<DateRangePickerValue>([
    new Date(2022, 1, 1),
    new Date(),
  ]);
  console.log(value);
  return (
    <Card>
      <Title>Number of poll respondents</Title>
      <DateRangePicker
        className="mx-auto max-w-md"
        value={value}
        onValueChange={setValue}
        locale={es}
        dropdownPlaceholder="Select a date range"
      />
      <LineChart
        className="mt-6"
        data={chartdata}
        index="date"
        categories={["Number of respondents"]}
        colors={["blue"]}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default RespondentsChart;
