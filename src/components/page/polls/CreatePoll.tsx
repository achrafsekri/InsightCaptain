import {
  BackspaceIcon,
  DocumentAddIcon,
  HandIcon,
  PlusCircleIcon,
  SaveIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  Card,
  Title,
  Text,
  Badge,
  BadgeDelta,
  Flex,
  TextInput,
  Icon,
} from "@tremor/react";
import { Button } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import React from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePoll } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useToast } from "../../../Context/ToastContext";
import Link from "next/link";

type checkboxOptions = {
  title: string;
  value?: string;
};
const schema = Yup.object().shape({
  question: Yup.string().required("Please enter a poll Question"),
  helperText: Yup.string(),
});
const CreatePoll = ({ data: poll, refetch }) => {
  const router = useRouter();
  const { pollId } = router.query;
  const showToast = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);
  const existingOptions = poll?.options.map((option) => ({
    id: option.id,
    title: option.title,
    value: option.title,
  }));
  const [checkboxOptions, setCheckboxOptions] = React.useState<
    checkboxOptions[]
  >(
    existingOptions.length === 0
      ? [
          {
            title: "Option 1",
            value: "",
          },
        ]
      : existingOptions
  );

  const defaultValues = {
    question: poll?.question,
    helperText: poll?.helperText,
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleeditPoll = (data) => {
    setLoading(true);
    console.log(data);
    const sendPayload = {
      question: data.question,
      helperText: data.helperText,
      pollTitle: poll.title,
      options: checkboxOptions.map((option) => ({
        title: option.value,
        id: option.id,
      })),
    };
    console.log(sendPayload);
    updatePoll(pollId as string, sendPayload)
      .then((res) => {
        showToast("success", "Poll updated successfully");
        console.log(res);
        refetch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
        setLoading(false);
      });
  };

  return (
    <>
      <Card className="relative mt-6">
        <Title className="text-xl">Create / update Poll</Title>
        <form onSubmit={handleSubmit(handleeditPoll)}>
          <div className="mt-4 flex flex-col space-y-4">
            <Controller
              name="question"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    className="mt-2 w-full"
                    placeholder="Poll question"
                    defaultValue={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {fieldState.error && (
                    <Text className="text-red-500">
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              name="helperText"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    className="mt-2 w-full"
                    placeholder="Helper text"
                    defaultValue={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {fieldState.error && (
                    <Text className="text-red-500">
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </div>

          <div className="mt-4 flex flex-col  space-y-2">
            {checkboxOptions.map((option, index) => (
              <Flex key={index} className="gap-2" justifyContent="between">
                <InputText
                  key={index}
                  className="mt-2 w-full"
                  placeholder={option.title}
                  defaultValue={option.value}
                  onChange={(e) => {
                    const newCheckboxOptions = [...checkboxOptions];
                    newCheckboxOptions[index].value = e.target.value;
                    setCheckboxOptions(newCheckboxOptions);
                  }}
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
              type="button"
              onClick={() => {
                setCheckboxOptions([
                  ...checkboxOptions,
                  { title: `Option ${checkboxOptions.length + 1}`, value: "" },
                ]);
              }}
            >
              Add Option
            </Button>
          </div>

          <Flex className="mt-4 gap-2" justifyContent="end">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </Flex>
        </form>
      </Card>
    </>
  );
};

export default CreatePoll;
