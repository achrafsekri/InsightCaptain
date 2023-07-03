import { Text, Card } from "@tremor/react";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import { SurveyFeild } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

type TextFieldProps = {
  data: SurveyFeild;
  control: any;
};

const TextField = ({ data, control }: TextFieldProps) => {
  const router = useRouter();
  const { surveyId } = router.query;
  const [edit, setEdit] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Card className="relative mt-6">
      <Text className="mt-4 text-lg font-bold text-gray-800">{data.title}</Text>
      <Text className="mb-4 text-sm">{data.helperText}</Text>
      <Controller
        name={`textFields.${data.id}`}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <InputTextarea
              autoResize
              onChange={(e) => field.onChange(e.target.value)}
              rows={5}
              cols={30}
              className="w-full "
            />
            {fieldState.error && (
              <Text className="text-red-500">{fieldState.error.message}</Text>
            )}
          </>
        )}
      />
    </Card>
  );
};

export default TextField;
