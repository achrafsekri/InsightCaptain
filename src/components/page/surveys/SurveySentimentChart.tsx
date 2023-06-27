import { AreaChart, Card, Title, Text, Subtitle, BarChart } from "@tremor/react";
import { formatPerformanceData } from "../../../lib/helpers";
import { SurveyPollChart } from "../../../types/SurveyPollTypes";

type Props = {
  pollsData: SurveyPollChart[];
  surveysData: SurveyPollChart[];
};



const dataFormatter = (number: number) => {
  return "% " + Intl.NumberFormat("us").format(number).toString();
};

export default function SurveySentimentChart({sentimentData}) {

  return (
    <Card>
    <Title>Sentiments </Title>
    <Subtitle>
      Sentiments of the surveyees about the survey
    </Subtitle>
    <BarChart
      className="mt-6"
      data={sentimentData}
      index="name"
      categories={["persantage"]}
      colors={["blue"]}
      valueFormatter={dataFormatter}
      yAxisWidth={48}
    />
  </Card>
  );
}
