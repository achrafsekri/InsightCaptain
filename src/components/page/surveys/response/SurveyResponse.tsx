import React from "react";
import {
  getLocation,
  getSurvey,
  respondToSurvey,
} from "../../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Card, Icon, Title, Text, Button, Subtitle } from "@tremor/react";
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

const SurveyResponse = ({ answer }) => {
  const router = useRouter();
  const surveyId = answer.surveyId;
  const survey = answer?.survey;
  return (
    <>
      <Card className="relative mt-6">
        <Link
          href={`/surveys/${surveyId as string}`}
          className="-ml-2 mb-2 flex cursor-pointer items-center text-sm font-semibold text-blue-500 "
        >
          <Icon className="h-6 w-6" icon={BackspaceIcon} />
          back to survey
        </Link>

        <Title className="text-2xl font-bold capitalize">{survey?.title}</Title>
        <Text>{survey.description}</Text>
      </Card>

      <Card className="relative mt-6">
        <Title className="text-xl">Respondant details</Title>
        <Subtitle className="capitalize"> {answer?.fullName}</Subtitle>
        <Subtitle> {answer?.email}</Subtitle>
        <Subtitle className="capitalize"> {answer?.location}</Subtitle>
      </Card>

      {answer?.surveyFeildAnswer.map((field, index) => {
        switch (field.surveyFeild.type) {
          case "TEXT":
            return <TextField data={field} key={index} />;
          case "RADIO":
            return <RadioField data={field} key={index} />;
          case "CHECKBOX":
            return <CheckBoxField data={field} key={index} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default SurveyResponse;
