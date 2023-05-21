import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

const data = [
  {
    name: "Twitter",
    value: 456,
  },
  {
    name: "Google",
    value: 351,
  },
  {
    name: "GitHub",
    value: 271,
  },
  {
    name: "Reddit",
    value: 191,
  },
  {
    name: "Youtube",
    value: 91,
  },
];

import React from "react";

const PollAnswerBarlist = () => {
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
      <BarList data={data} className="mt-2" />
    </Card>
  );
};

export default PollAnswerBarlist;
