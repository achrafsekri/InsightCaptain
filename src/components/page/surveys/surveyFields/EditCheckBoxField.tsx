import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { Card, Flex, Text, TextInput } from "@tremor/react";
import { Button } from "@tremor/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateSurveyField } from "../../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useSingleSurvey } from "../../../../pages/surveys/[surveyId]/edit";
import { SurveyFeild } from "@prisma/client";

type checkboxOptions = {
  title: string;
};

type EditSurveyFieldProps = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  data: SurveyFeild;
};

const schema = yup.object().shape({
  title: yup.string().required(),
  helperText: yup.string().required(),
});

const EditCheckBoxField = ({
  setEdit,
  data: surveyField,
}: EditSurveyFieldProps) => {
  const [checkboxOptions, setCheckboxOptions] = React.useState<
    checkboxOptions[]
  >([
    {
      title: "Option 1",
    },
  ]);
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
        <div className="mt-4 flex flex-col gap-2 space-y-2">
          <Text className="text-lg font-semibold text-gray-600">Options</Text>
          {checkboxOptions.map((option, index) => (
            <Flex key={index} className="mt-4 gap-2" justifyContent="between">
              <TextInput
                key={index}
                className=" w-full"
                placeholder={option.title}
              />
              <Button
                icon={TrashIcon}
                color="red"
                variant="secondary"
                onClick={() => {
                  const newCheckboxOptions = [...checkboxOptions];
                  newCheckboxOptions.splice(index, 1);
                  setCheckboxOptions(newCheckboxOptions);
                }}
              >
                Delete
              </Button>
            </Flex>
          ))}
          <Button
            icon={PlusCircleIcon}
            onClick={() => {
              setCheckboxOptions([
                ...checkboxOptions,
                { title: `Option ${checkboxOptions.length + 1}` },
              ]);
            }}
          >
            Add Option
          </Button>
        </div>

        <Flex className="mt-4 gap-2" justifyContent="end">
          <Button
            color="red"
            variant="secondary"
            onClick={() => setEdit(false)}
          >
            Cancel
          </Button>
          <Button icon={PlusCircleIcon} type="submit">
            Save Field
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default EditCheckBoxField;
