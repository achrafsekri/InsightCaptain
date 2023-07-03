import React from "react";
import Keywords from "../../global/Keywords";

type Props = {
  keywords: {
    Keyword: string;
    importance: number;
  }[];
};

const SurveyKeywords = ({ keywords }: Props) => {
  return <Keywords keywords={keywords} />;
};

export default SurveyKeywords;
