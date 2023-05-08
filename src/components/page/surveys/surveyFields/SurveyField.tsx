import { Card } from "@tremor/react";
import React from "react";
import CheckBoxField from "./CheckBoxField";
import RadioField from "./RadioField";
import TextField from "./TextField";

type SurveyFieldProps = {
  type: string;
};

const SurveyField = ({ type }: SurveyFieldProps) => {
  return (
    <Card className="relative mt-6">
      {type === "checkbox" && <CheckBoxField />}
      {type === "radio" && <RadioField />}
      {type === "text" && <TextField />}
    </Card>
  );
};

export default SurveyField;
