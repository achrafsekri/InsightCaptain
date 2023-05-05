import React from "react";
import { Card, Title, Badge, BadgeDelta } from "@tremor/react";

const keywords = [
  "keyword1",
  "keyword2",
  "pharse zfez",
  "keyword3",
  "keyword4 keyword7keyword7",
  "keyword5 keyword7",
  "keyword6 keyword7 keyword7keyword7 keyword7",
  "keyword7keyword7keyword7",
  "loefh eufbez zde",
  "keyword8",
  "keyword1",
  "keyword2",
  "pharse zfez",
  "keyword3",
  "keyword4",
  "keyword5",
  "keyword6",
  "keyword7",
  "loefh eufbez zde",
  "keyword8",
];

const Keywords = () => {
  return (
    <Card>
      <Title>Keywords</Title>
      <p className="text-sm italic">
        Our machine learning algorithimes have identified the following keywords
        as the most important and repeated in the Survey responses.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        {keywords.map((keyword, index) => (
          <Badge key={index} size="lg">
            {keyword}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default Keywords;
