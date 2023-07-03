import React from "react";
import { Card, Title, Badge } from "@tremor/react";

type Props = {
  keywords: {
    Keyword: string;
    importance: number;
  }[];
};

const Keywords = ({ keywords }: Props) => {
  return (
    <Card>
      <Title>Keywords</Title>
      <p className="text-sm italic">
        Our machine learning algorithimes have identified the following keywords
        as the most important and repeated in the Survey responses.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        {keywords?.map((keyword, index) => (
          <Badge key={index} size="lg">
            {keyword.keyword}
          </Badge>
        ))}
        {!Keywords && (
          <div className="text-sm italic">
            No keywords found. Please try again later.
          </div>
        )}
      </div>
    </Card>
  );
};

export default Keywords;
