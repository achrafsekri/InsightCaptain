import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { PollOption, type Poll, PollAnswer } from "@prisma/client";
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
  Subtitle,
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

type Props = {
  answer: PollAnswer;
};

const RespondToPollPage = ({ answer }) => {
  const router = useRouter();
  const pollId = answer.pollId;
  const poll = answer?.poll;

  return (
    <div>
      <Card className="relative mt-6">
        <Link
          href={`/surveys/${pollId as string}`}
          className="-ml-2 mb-2 flex cursor-pointer items-center text-sm font-semibold text-blue-500 "
        >
          <Icon className="h-6 w-6" icon={BackspaceIcon} />
          back to Poll
        </Link>

        <Title className="text-2xl font-bold capitalize">{poll?.title}</Title>
        <Text>{poll.description}</Text>
      </Card>

      <Card className="relative mt-6">
        <Title className="text-xl">Respondant details</Title>
        <Subtitle className="capitalize"> {answer?.fullName}</Subtitle>
        <Subtitle> {answer?.email}</Subtitle>
        <Subtitle> {answer?.age}</Subtitle>
        <Subtitle className="capitalize"> {answer?.location}</Subtitle>
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
      </Card>
    </div>
  );
};

export default RespondToPollPage;
