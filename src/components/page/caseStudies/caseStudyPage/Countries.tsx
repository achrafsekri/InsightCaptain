import React from "react";
import { Card, Metric, Text, Flex, Bold, List, ListItem } from "@tremor/react";
const countries = [
  {
    name: "Tunisia",
    stat: "18.3%",
    status: "increase",
  },
  {
    name: "Germany",
    stat: "8.3%",
    status: "moderateIncrease",
  },
  {
    name: "Italy",
    stat: "1.6%",
    status: "unchanged",
  },
  {
    name: "France",
    stat: "5.1%",
    status: "moderateDecrease",
  },
  {
    name: "Switzerland",
    stat: "5.1%",
    status: "moderateDecrease",
  },
  {
    name: "Germany",
    stat: "5.1%",
    status: "moderateDecrease",
  },
  {
    name: "Spain",
    stat: "5.1%",
    status: "moderateDecrease",
  },
  {
    name: "Algeria",
    stat: "5.1%",
    status: "moderateDecrease",
  },
];

const Countries = () => {
  return (
    <Card>
      <Metric>Countries</Metric>
      <Flex className="mt-6">
        <Text>
          <Bold>Switzerland</Bold>
        </Text>
        <Text>
          <Bold>18.3%</Bold>
        </Text>
      </Flex>
      <List className="mt-1">
        {countries.map((country) => (
          <ListItem key={country.name}>
            <Flex justifyContent="start" className="space-x-2.5 truncate">
              <Text className="truncate">{country.name}</Text>
            </Flex>
            <Text>{country.stat}</Text>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default Countries;
