import { AreaChart, Card, Title, Text } from "@tremor/react";
import { formatPerformanceData } from "../../../../lib/helpers";
import { SurveyPollChart } from "../../../../types/SurveyPollTypes";

type Props = {
  pollsData: SurveyPollChart[];
  surveysData: SurveyPollChart[];
};

// const data = [
//   {
//     Month: "Jan 21",
//     Surveys: 2890,
//     Polls: 2400,
//   },
//   {
//     Month: "Feb 21",
//     Surveys: 1890,
//     Polls: 1398,
//   },
//   {
//     Month: "Mar 21",
//     Surveys: 2190,
//     Polls: 1900,
//   },
//   {
//     Month: "Apr 21",
//     Surveys: 3470,
//     Polls: 3100,
//   },
//   {
//     Month: "May 21",
//     Surveys: 2170,
//     Polls: 1650,
//   },
//   {
//     Month: "Jun 21",
//     Surveys: 3170,
//     Polls: 2450,
//   },
//   {
//     Month: "Jul 21",
//     Surveys: 3490,
//     Polls: 2910,
//   },
//   {
//     Month: "Aug 21",
//     Surveys: 2190,
//     Polls: 1600,
//   },
//   // ...
//   {
//     Month: "Jan 22",
//     Surveys: 3890,
//     Polls: 2980,
//   },
// ];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Performance({ pollsData, surveysData }: Props) {
  const data = formatPerformanceData(pollsData, surveysData);
console.log(data);
  return (
    <Card>
      <Title>Performance</Title>
      <Text>Comparison between Survey and Poll responses</Text>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={["Surveys", "Polls"]}
        index="Month"
        colors={["indigo", "fuchsia"]}
      />
    </Card>
  );
}
