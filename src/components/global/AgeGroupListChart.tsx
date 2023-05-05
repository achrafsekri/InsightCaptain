import React from "react";
import { Card, Metric, Text, Flex, Bold, List, ListItem } from "@tremor/react";
const ageGroup = [
  {
    age: "24-32",
    stat: "18.3%",
    status: "increase",
  },
  {
    age: ">18",
    stat: "8.3%",
    status: "moderateIncrease",
  },
  {
    age: "40-49",
    stat: "1.6%",
    status: "unchanged",
  },
  {
    age: "<60",
    stat: "5.1%",
    status: "moderateDecrease",
  },
  {
    age: "32-40",
    stat: "5.1%",
    status: "moderateDecrease",
  },
];

const AgeGroupListChart = ({ type }) => {
  return (
    <Card>
      <Metric className="mb-2">Age</Metric>
      <Text>Top 5 age groups with the most {type} respondants</Text>
      <Flex className="mt-6">
        <Text>
          <Bold>18-24</Bold>
        </Text>
        <Text>
          <Bold>18.3%</Bold>
        </Text>
      </Flex>
      <List className="mt-1">
        {ageGroup.map((group, index) => (
          <ListItem key={index}>
            <Flex justifyContent="start" className="space-x-2.5 truncate">
              <Text className="truncate">{group.age}</Text>
            </Flex>
            <Text>{group.stat}</Text>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default AgeGroupListChart;
