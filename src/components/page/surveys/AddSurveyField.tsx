import {
  PlusCircleIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Card, Title, Flex, TextInput, Icon } from "@tremor/react";
import { Button } from "@tremor/react";
import { Dropdown, DropdownItem } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Ripple } from "primereact/ripple";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSurveyField } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useSingleSurvey } from "../../../pages/surveys/[surveyId]/edit";
import { TypeOf, set } from "zod";
import { useToast } from "../../../Context/ToastContext";
import GenerateQuestionModal from "./GenerateQuestionModal";
import clsx from "clsx";

type checkboxOptions = {
  title: string;
  value?: string;
};

const options = [
  {
    name: "Text",
    value: "Text",
  },
  {
    name: "Checkbox",
    value: "Checkbox",
  },
  {
    name: "Radio",
    value: "Radio",
  },
];

const SurveyField = () => {
  const router = useRouter();
  const { surveyId } = router.query;
  const { refetch, survey } = useSingleSurvey();
  const showToast = useToast();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checkboxOptions, setCheckboxOptions] = React.useState<
    checkboxOptions[]
  >([{ title: "", value: "" }]);

  const [radioOptions, setRadioOptions] = React.useState<checkboxOptions[]>([
    {
      title: "option 1",
      value: "",
    },
  ]);
  const [addSurveyField, setAddSurveyField] = React.useState<boolean>(false);
  const [generateSurveyQuestion, setGenerateSurveyQuestion] =
    useState<boolean>(false);
  const [pickedQuestion, setPickedQuestion] = useState<string>("");
  const schema = Yup.object().shape({
    title: Yup.string().required("Please enter a Field Title"),
    helperText: Yup.string(),
    selectedOption: Yup.string()
      .oneOf(["Checkbox", "Radio", "Text"])
      .required('Please select a Field Type'),
    

  });
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log("errors", errors);
  useEffect(() => {
    if (pickedQuestion) {
      setValue("title", pickedQuestion);
    }
  }, [pickedQuestion]);

  const handleAddSurvey = (data) => {
    console.log(data);

    setLoading(true);
    if (data.selectedOption === "Text") {
      const type = String(data.selectedOption);
      const packageData = {
        title: data.title,
        helperText: data.helperText,
        order: survey.surveyField.length,
        type: type.toUpperCase(),
      };
      createSurveyField(packageData, surveyId as string)
        .then((res) => {
          refetch();
          setAddSurveyField(false);
          setCheckboxOptions([{ title: "", value: "" }]);
          setRadioOptions([{ title: "", value: "" }]);
          setSelectedOption(null);
          setLoading(false);
          showToast("success", "Survey field added successfully");
        })
        .catch((err) => {
          setLoading(false);
          showToast("error", "Something went wrong");
          console.log(err);
        });
    }
    if (data.selectedOption === "Checkbox") {
      const type = String(data.selectedOption);
      const options = checkboxOptions.map((option) => {
        return {
          title: option.value,
        };
      });

      const packageData = {
        title: data.title,
        helperText: data.helperText,
        type: type.toUpperCase(),
        order: survey.surveyField.length,
        surveyFeildOptions: options,
      };
      createSurveyField(packageData, surveyId as string)
        .then((res) => {
          refetch();
          setAddSurveyField(false);
          setCheckboxOptions([{ title: "", value: "" }]);
          setRadioOptions([{ title: "", value: "" }]);
          setSelectedOption(null);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
    if (data.selectedOption === "Radio") {
      const type = String(data.selectedOption);
      const options = radioOptions.map((option) => {
        return {
          title: option.value,
        };
      });

      const packageData = {
        title: data.title,
        helperText: data.helperText,
        order: survey.surveyField.length,
        type: type.toUpperCase(),
        surveyFeildOptions: options,
      };
      createSurveyField(packageData, surveyId as string)
        .then((res) => {
          refetch();
          setAddSurveyField(false);
          setCheckboxOptions([{ title: "", value: "" }]);
          setRadioOptions([{ title: "", value: "" }]);
          setSelectedOption(null);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      {generateSurveyQuestion && (
        <GenerateQuestionModal
          isOpen={generateSurveyQuestion}
          setIsOpen={setGenerateSurveyQuestion}
          setPickedQuestion={setPickedQuestion}
        />
      )}
      {addSurveyField && (
        <Card className="relative mt-6">
          <form onSubmit={handleSubmit(handleAddSurvey)}>
            <Title className="text-2xl">Create survey fields</Title>
            <Flex className="mt-4 gap-4" justifyContent="end">
              <Flex className="gap-1" alignItems="end">
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      {!pickedQuestion && (
                        <TextInput
                          className={clsx(
                            "mt-2",
                            `${errors.title && "border-red-500"}`
                          )}
                          placeholder="Field Title"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                      {pickedQuestion && (
                        <TextInput
                          className={clsx(
                            "mt-2",
                            `${errors.title && "border-red-500"}`
                          )}
                          placeholder="Field Title"
                          defaultValue={pickedQuestion}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      )}
                    </>
                  )}
                />

                <div>
                  <Icon
                    icon={SparklesIcon}
                    variant="solid"
                    size="md"
                    className="cursor-pointer"
                    color="violet"
                    onClick={() => setGenerateSurveyQuestion(true)}
                    tooltip="Generate a field title using AI"
                  />
                  <Ripple />
                </div>
              </Flex>
              <Controller
                name="selectedOption"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      className={clsx(
                        "mt-2",
                        `${errors.selectedOption && "border-red-500"}`
                      )}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedOption(value);
                      }}
                      placeholder="Feild Type"
                    >
                      {options.map((option, index) => (
                        <DropdownItem
                          key={index}
                          value={option.value}
                          text={option.name}
                        />
                      ))}
                    </Dropdown>
                  </>
                )}
              />
            </Flex>
            {errors.selectedOption && (
              <p className="mt-2 text-sm text-red-500">
                {errors.selectedOption.message}
              </p>
            )}
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}

            <Controller
              name="helperText"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    className="mt-2"
                    placeholder="Helper Text"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </>
              )}
            />
            {selectedOption === "Checkbox" ? (
              <div className="mt-4 flex flex-col gap-2 space-y-2">
                {checkboxOptions &&
                  checkboxOptions?.map((option, index) => (
                    <Flex
                      key={index}
                      className="gap-2"
                      justifyContent="between"
                    >
                      <InputText
                        key={index}
                        className="mt-2 w-full"
                        onChange={(e) => {
                          const newCheckboxOptions = [...checkboxOptions];
                          newCheckboxOptions[index].value = e.target.value;
                          setCheckboxOptions(newCheckboxOptions);
                        }}
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
                    const newCheckboxOptions = [...checkboxOptions];
                    newCheckboxOptions.push({
                      title: `Option ${checkboxOptions.length + 1}`,
                    });
                    setCheckboxOptions(newCheckboxOptions);
                  }}
                >
                  Add Option
                </Button>
              </div>
            ) : null}
            {selectedOption === "Radio" ? (
              <div className="mt-4 flex flex-col gap-2 space-y-2">
                {radioOptions.map((option, index) => (
                  <Flex key={index} className="gap-2" justifyContent="between">
                    <InputText
                      key={index}
                      className="mt-2 w-full"
                      placeholder={option.title}
                      onChange={(e) => {
                        const newRadioOptions = [...radioOptions];
                        newRadioOptions[index].value = e.target.value;
                        setRadioOptions(newRadioOptions);
                      }}
                    />
                    <Button
                      icon={TrashIcon}
                      color="red"
                      variant="secondary"
                      onClick={() => {
                        const newRadioOptions = [...radioOptions];
                        newRadioOptions.splice(index, 1);
                        setRadioOptions(newRadioOptions);
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
                    setRadioOptions([
                      ...radioOptions,
                      { title: `Option ${radioOptions.length + 1}`, value: "" },
                    ]);
                  }}
                >
                  Add Option
                </Button>
              </div>
            ) : null}
            <Flex className="mt-4 gap-2" justifyContent="end">
              <Button
                color="red"
                variant="secondary"
                type="reset"
                onClick={() => {
                  setCheckboxOptions([{ title: "", value: "" }]);
                  setRadioOptions([{ title: "", value: "" }]);
                  setSelectedOption(null);
                  setGenerateSurveyQuestion(false);
                  reset();
                  setPickedQuestion("");
                  setAddSurveyField(false);
                }}
              >
                Cancel
              </Button>
              <Button
                icon={PlusCircleIcon}
                // onClick={() => setAddSurveyField(false)}
                type="submit"
                loading={loading}
              >
                Save Field
              </Button>
            </Flex>
          </form>
        </Card>
      )}
      {!addSurveyField && (
        <div className="my-6 flex justify-center">
          <Button icon={PlusCircleIcon} onClick={() => setAddSurveyField(true)}>
            Add Field
          </Button>
        </div>
      )}
    </>
  );
};

export default SurveyField;
