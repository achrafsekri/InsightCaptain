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
  
];

const ListChart = ({type}) => {
  return (
    <Card>
      <Metric className="mb-2">Countries</Metric>
      <Text>Top 5 countries with the most {type} respondants</Text>
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

export default ListChart;
