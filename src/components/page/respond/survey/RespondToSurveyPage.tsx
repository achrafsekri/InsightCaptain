import React from "react";
import {
  getLocation,
  getSurvey,
  respondToSurvey,
} from "../../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Card, Icon, Title, Text, Button } from "@tremor/react";
import Link from "next/link";
import { BackspaceIcon } from "@heroicons/react/outline";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Survey } from "@prisma/client";
import { useToast } from "../../../../Context/ToastContext";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import clsx from "clsx";
import CheckBoxField from "./surveyFields/CheckBoxField";
import RadioField from "./surveyFields/RadioField";
import TextField from "./surveyFields/TextField";

const schema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  name: Yup.string().required("Name is required"),
  age: Yup.number().required("Age is required"),
});

const defaultValues = {
  email: "",
  name: "",
  age: 0,
};

const RespondToSurveyPage = () => {
  const router = useRouter();
  const { surveyId } = router.query;
  const { preview } = router.query;
  const showToast = useToast();
  const [loading, setLoading] = React.useState(false);
  const {
    data: survey,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey>(["survey"], () => getSurvey(surveyId as string));

  const {
    data: location,
    isLoading: isLocationLoading,
    isError: isLocationError,
    error: locationError,
    refetch: refetchLocation,
  } = useQuery(["location"], () => getLocation());

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const onSubmit = async (data: any) => {
    if (preview) return showToast("success", "This is a preview");
    setLoading(true);
    // get textfield id and value
    let textFields = [];
    if (data.textFields) {
      textFields = Object.keys(data.textFields).map((key) => {
        return {
          surveyFieldId: key,
          answer: data.textFields[key],
          type: "text",
        };
      });
    }
    let radioFields = [];
    if (data.radioFields) {
      radioFields = Object.keys(data.radioFields).map((key) => {
        return {
          surveyFieldId: key,
          pickedOptions: data.radioFields[key],
          type: "radio",
        };
      });
    }
    let checkboxFields = [];
    if (data.checkboxFields) {
      checkboxFields = Object.keys(data.checkboxFields).map((key) => {
        return {
          surveyFieldId: key,
          pickedOptions: data.checkboxFields[key],
          type: "checkbox",
        };
      });
    }

    const payload = {
      fullName: data.name,
      email: data.email,
      age: data.age,
      location: location?.country,
      ipAddress: location?.ip,
      answer: [...textFields, ...radioFields, ...checkboxFields],
    };
    respondToSurvey(payload, surveyId as string)
      .then((res) => {
        if (res.status === "201") {
          showToast("success", "Survey submitted successfully");
          reset();
          setLoading(false);
          router.push(`/respond/thankyou`).catch((err) => {
            console.log(err);
          });
        } else {
          showToast("error", "Something went wrong");
          setLoading(false);
        }
      })
      .catch((err) => {
        showToast("error", "Something went wrong");
        setLoading(false);
      });
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error as string}</div>;
  return (
    <>
      <Card className="relative mt-6">
        {preview && (
          <Link
            href={`/surveys/${surveyId as string}/edit`}
            className="-ml-2 mb-2 flex cursor-pointer items-center text-sm font-semibold text-blue-500 "
          >
            <Icon className="h-6 w-6" icon={BackspaceIcon} />
            back to survey
          </Link>
        )}
        <Title className="text-2xl font-bold capitalize">{survey?.title}</Title>
        <Text className="text-gray-500  ">
          please enter your detail and proceed to respond to this survey
        </Text>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="relative mt-6">
          <Title className="text-xl">Your details</Title>
          <Text className="text-gray-500">
            Please enter your details to respond to this poll
          </Text>
          <div className="mt-4 flex flex-col space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor="name">Name</label>
                  <InputText
                    className={clsx(
                      "mt-2 w-full",
                      fieldState.error && "p-invalid"
                    )}
                    placeholder="Full name"
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
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor="email">Email</label>
                  <InputText
                    className={clsx(
                      "mt-2 w-full",
                      fieldState.error && "p-invalid"
                    )}
                    placeholder="Email"
                    defaultValue={field.value}
                    type="email"
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
              name="age"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor="age">Age</label>
                  <InputNumber
                    className={clsx(
                      "mt-2 w-full",
                      fieldState.error && "p-invalid"
                    )}
                    placeholder="Age"
                    defaultValue={field.value}
                    onChange={(e) => {
                      field.onChange(parseInt(e.value));
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
        </Card>

        {
          // @ts-ignore
          !isLoading &&
            survey?.surveyField.map((field, index) => {
              switch (field.type) {
                case "TEXT":
                  return (
                    <TextField data={field} key={index} control={control} />
                  );
                case "RADIO":
                  return (
                    <RadioField data={field} key={index} control={control} />
                  );
                case "CHECKBOX":
                  return (
                    <CheckBoxField data={field} key={index} control={control} />
                  );
                default:
                  return null;
              }
            })
        }
        <div className="relative mt-6 flex items-center justify-end gap-4">
          <Button
            type="reset"
            variant="secondary"
            className="ml-4 rounded-md  px-4 py-2"
            color="red"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default RespondToSurveyPage;
