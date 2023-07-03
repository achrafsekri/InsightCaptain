import { PollOption } from "@prisma/client";
import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

import React from "react";

type Props = {
  data: PollOption[];
  question: string;
  totalVotes: number;
};

const PollAnswerBarlist = ({ data, question, totalVotes }: Props) => {
  const barListData = data.map((item) => {
    return {
      name: item.title,
      value: item.votes,
    };
  });
  return (
    <Card className="max-w-lg">
      <Title>{question}</Title>
      <Text className="mt-2">Total votes: {totalVotes}</Text>
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
