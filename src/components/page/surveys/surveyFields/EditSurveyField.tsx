import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { SurveyFeild } from "@prisma/client";
import { Card, Flex, Text, TextInput } from "@tremor/react";
import { Button } from "@tremor/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateSurveyField } from "../../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useSingleSurvey } from "../../../../pages/surveys/[surveyId]/edit";

const schema = yup.object().shape({
  title: yup.string().required(),
  helperText: yup.string().required(),
});

type RadioOptions = {
  title: string;
};

type EditSurveyFieldProps = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  data: SurveyFeild;
};

const EditSurveyField = ({ setEdit, data: surveyField }: EditSurveyFieldProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { surveyId } = router.query;
  const { refetch } = useSingleSurvey();

  const defaultValues = {
    title: surveyField.title,
    helperText: surveyField.helperText,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleEdit = (data) => {
    setLoading(true);
    updateSurveyField(surveyField.id, surveyId as string, data)
      .then(() => {
        setEdit(false);
        setLoading(false);
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card className="relative mt-6">
      <form onSubmit={handleSubmit(handleEdit)}>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <TextInput
                className="mt-2"
                placeholder={surveyField.title}
                default={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </>
          )}
        />
        <Controller
          name="helperText"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <TextInput
                className="mt-2"
                placeholder={surveyField.helperText}
                default={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </>
          )}
        />

        <Flex className="mt-4 gap-2" justifyContent="end">
          <Button
            color="red"
            variant="secondary"
            onClick={() => setEdit(false)}
          >
            Cancel
          </Button>
          <Button icon={PlusCircleIcon} type="submit" loading={loading}>
            Save Field
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default EditSurveyField;
