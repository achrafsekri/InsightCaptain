import { Card, Text } from "@tremor/react";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import { SurveyFeild } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

type CheckBoxFieldProps = {
  data: SurveyFeild;
  control: any;
};

const CheckBoxField = ({ data, control }: CheckBoxFieldProps) => {
  const router = useRouter();
  const { surveyId } = router.query;
  const [edit, setEdit] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Card className="relative mt-6">
      <Text className="mt-4 text-lg font-bold text-gray-800">{data.title}</Text>
      <Text className="text-sm">{data.helperText}</Text>
      <Controller
        name={`checkboxFields.${data.id}`}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className="mt-6 flex flex-col gap-3">
              {data.surveyFeildOption.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox
                    inputId={option.title}
                    checked={field.value?.includes(option.id)}
                    value={option.id}
                    inputRef={field.ref}
                    name={option.id}
                    onChange={(e) => {
                      const current = field.value;
                      if (!current) {
                        field.onChange([e.value]);
                      } else {
                        if (current?.includes(e.value)) {
                          const filtered = current.filter(
                            (item: string) => item !== e.value
                          );
                          field.onChange(filtered);
                        } else {
                          field.onChange([...current, e.value]);
                        }
                      }
                    }}
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
          </>
        )}
      />
    </Card>
  );
};

export default CheckBoxField;
