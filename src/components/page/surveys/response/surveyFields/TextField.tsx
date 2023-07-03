import { Text, Card, Title, Subtitle } from "@tremor/react";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import { SurveyFeild } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

type TextFieldProps = {
  data: SurveyFeild;
};

const TextField = ({ data }: TextFieldProps) => {
  const router = useRouter();
  const surveyField = data.surveyFeild;

  return (
    <Card className="relative mt-6">
      <Title className="mt-4 text-lg font-bold text-gray-800">{surveyField.title}</Title>
      <Subtitle className="mb-4 text-sm">{surveyField.helperText}</Subtitle>
      <Text className="text-md">
        {data.answer}
      </Text>
    </Card>
  );
};

export default TextField;
