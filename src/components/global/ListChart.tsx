import React from "react";
import { Card, Metric, Text, Flex, Bold, List, ListItem } from "@tremor/react";
import { CountryWithMostResponses } from "../page/caseStudies/caseStudyPage/CaseStudyAnalytics";


type Props = {
  type: string;
  data?: CountryWithMostResponses[];
  countryWithMostResponses?: CountryWithMostResponses[];
};

const ListChart = ({ type, countryWithMostResponses, data }: Props) => {
  const unavailableCount = 8 - (data?.length + 1);
  const unavailableCountries = Array(unavailableCount || 8).fill("0");
  return (
    <Card>
      <Metric className="mb-2">Countries</Metric>
      <Text>Top 7 countries with the most {type} respondants</Text>
      <Flex className="mt-6">
        <Text>
          <Bold>
            {countryWithMostResponses?.length > 0
              ? countryWithMostResponses[0]?.location
              : "No responses yet"}
          </Bold>
        </Text>
        <Text>
          <Bold>
            {countryWithMostResponses?.length > 0
              ? countryWithMostResponses[0]?._count.location
              : "No responses yet"}
          </Bold>
        </Text>
      </Flex>
      <List className="mt-1">
        {data &&
          data.map((country) => (
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

export default ListChart;
