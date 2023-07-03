import { Card, Subtitle, Text, Title } from "@tremor/react";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import { SurveyFeild } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

type CheckBoxFieldProps = {
  data: SurveyFeild;
};

const CheckBoxField = ({ data }: CheckBoxFieldProps) => {
  const router = useRouter();
  const surveyField = data.surveyFeild;

  return (
    <Card className="relative mt-6">
      <Title className="mt-4 text-lg font-bold text-gray-800">
        {surveyField.title}
      </Title>
      <Subtitle className="text-sm">{surveyField.helperText}</Subtitle>

      <div className="mt-6 flex flex-col gap-3">
        {surveyField.surveyFeildOption.map((option, index) => (
          <div key={index} className="flex items-center">
            <Checkbox
              inputId={option.title}
              value={option.id}
              name={option.id}
              checked={data.pickedOptions
                .map((option) => option.id)
                .includes(option.id)}
            />
            <label
              htmlFor={option.title}
              className="text-md ml-2 font-medium text-gray-600"
            >
              {option.title}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CheckBoxField;
