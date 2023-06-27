import React from "react";
import { Card, Metric, Text, Flex, Bold, List, ListItem } from "@tremor/react";
import { findMaxAgeGroup } from "../../lib/helpers";

type AgeGroupListChartProps = {
  type: string;
  data: { name: string; value: number; persantage: number }[];
};

const AgeGroupListChart = ({ type, data }: AgeGroupListChartProps) => {
  const topGroup: { name: string; value: number; persantage: number } =
    findMaxAgeGroup(data);
  return (
    <Card>
      <Metric className="mb-2">Age</Metric>
      <Text>Top 7 age groups with the most {type} respondants</Text>
      <Flex className="mt-6">
        <Text>
          <Bold>{topGroup.name}</Bold>
        </Text>
        <Text>
          <Bold>{topGroup.value}</Bold>
        </Text>
      </Flex>
      <List className="mt-1">
        {data?.map((group, index) => (
          <ListItem key={index}>
            <Flex justifyContent="start" className="space-x-2.5 truncate">
              <Text className="truncate">{group.name}</Text>
            </Flex>
            <Text>{group.persantage}%</Text>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default AgeGroupListChart;
