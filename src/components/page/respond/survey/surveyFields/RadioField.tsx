import { Card, Text } from "@tremor/react";
import { RadioButton } from "primereact/radiobutton";
import React from "react";
import { type SurveyFeild } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

type RadioFieldProps = {
  data: SurveyFeild;
  control?: any;
};

const RadioField = ({ data, control }: RadioFieldProps) => {
  const router = useRouter();
  const { surveyId } = router.query;
  const [edit, setEdit] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Card className="relative mt-6">
      <Text className="mt-4 text-lg font-bold text-gray-800">{data.title}</Text>
      <Text className="text-sm">{data.helperText}</Text>
      <Controller
        name={`radioFields.${data.id}`}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className="mt-6 flex flex-col gap-3">
              {data.surveyFeildOption.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioButton
                    inputId={option.title}
                    checked={field.value === option.id}
                    value={option.id}
                    inputRef={field.ref}
                    name={option.id}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-md ml-2 font-medium text-gray-600"
                  >
                    {option.title}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      />
    </Card>
  );
};

export default RadioField;
