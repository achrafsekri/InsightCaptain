import React from "react";
import { Card, Metric, Text, Flex, Bold, List, ListItem } from "@tremor/react";
import { type CountryWithMostResponses } from "./CaseStudyAnalytics";

type Props = {
  data: CountryWithMostResponses[] | [];
};

const Countries = ({ data }: Props) => {
  const unavailableCount = 8 - (data?.length + 1);
  const unavailableCountries = Array(unavailableCount).fill("0");

  return (
    <Card>
      <Metric>Countries</Metric>
      <Flex className="mt-6">
        <Text>
          <Bold>{data[0]?.location}</Bold>
        </Text>
        <Text>
          <Bold>{data[0]?._count.location}</Bold>
        </Text>
      </Flex>
      <List className="mt-1">
        {data?.map((country) => (
          <ListItem key={country.location}>
            <Flex justifyContent="start" className="space-x-2.5 truncate">
              <Text className="truncate">{country.location}</Text>
            </Flex>
            <Text>{country._count.location}</Text>
          </ListItem>
        ))}
        {unavailableCountries.map((country, index) => (
          <ListItem key={index}>
            <Flex justifyContent="start" className="space-x-2.5 truncate">
              <Text className="truncate">Not enough data</Text>
            </Flex>
            <Text>0</Text>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default Countries;
