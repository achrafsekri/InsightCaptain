import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { PollOption, type Poll } from "@prisma/client";
import {
  getLocation,
  getPollById,
  respondToPoll,
} from "../../../../lib/apiCalls";
import { BackspaceIcon } from "@heroicons/react/outline";
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
import { InputNumber } from "primereact/inputnumber";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../../../Context/ToastContext";
import {
  RadioButton,
  type RadioButtonChangeEvent,
} from "primereact/radiobutton";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

const RespondToPollPage = () => {
  const router = useRouter();
  const { pollId } = router.query;
  const { preview } = router.query;
  const showToast = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pickedOption, setPickedOption] = useState<string | null>(null);
  console.log("params", preview);
  const {
    data: poll,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Poll>(["poll"], () => getPollById(String(pollId)));
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
    showToast("success", "Sending response");
    if (preview) return showToast("success", "This is a preview");
    if (!pickedOption) return showToast("error", "Please select an option");
    setLoading(true);
    const payLoad = {
      pickedOption: pickedOption,
      email: data.email,
      pollId: pollId,
      location: location?.country,
      age: data.age,
      name: data.name,
    };
    respondToPoll(payLoad)
      .then((res) => {
        console.log(res);
        if (res.status === "201") {
          showToast("success", "Response recorded successfully");
          setPickedOption(null);
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
  return (
    <div>
      <Card className="relative mt-6">
        {preview && (
          <Link
            href={`/polls/${pollId}/edit`}
            className="-ml-2 mb-2 flex cursor-pointer items-center text-sm font-semibold text-blue-500 "
          >
            <Icon className="h-6 w-6" icon={BackspaceIcon} />
            back to poll
          </Link>
        )}
        <Title className="text-2xl font-bold capitalize">{poll?.title}</Title>
        <Text className="text-gray-500  ">
          please enter your detail and proceed to respond to this poll
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
        <Card className="relative mt-6">
          <Title className="text-xl">{poll?.question}</Title>
          <Text className="text-gray-500">{poll?.helperText}</Text>

          <div className="mt-4 flex flex-col  space-y-2">
            {poll?.options.map((option: PollOption, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <RadioButton
                  inputId={option.title}
                  name={option.title}
                  value={option.id}
                  onChange={(e: RadioButtonChangeEvent) => {
                    setPickedOption(e.value);
                  }}
                  checked={pickedOption === option.id}
                />
                <Text className="text-xl">{option.title}</Text>
              </div>
            ))}
          </div>

          <Flex className="mt-4 gap-2" justifyContent="end">
            <Button type="submit" loading={loading}>
              Send
            </Button>
          </Flex>
        </Card>
      </form>
    </div>
  );
};

export default RespondToPollPage;
