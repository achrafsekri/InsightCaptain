import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

import React from "react";

const PollAnswerBarlist = ({ data }) => {
  const barListData = data.map((item) => {
    return {
      name: item.title,
      value: item.votes,
    };
  });
  return (
    <Card className="max-w-lg">
      <Title>Which of these is your favourite social media platform</Title>
      <Flex className="mt-4">
        <Text>
          <Bold>option</Bold>
        </Text>
        <Text>
          <Bold>N°votes</Bold>
        </Text>
      </Flex>
      <BarList data={barListData} className="mt-2" />
    </Card>
  );
};

export default PollAnswerBarlist;
