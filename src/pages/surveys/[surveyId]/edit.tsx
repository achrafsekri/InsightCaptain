import React from "react";
import { Card, Title, Text } from "@tremor/react";
import MainLayout from "../../../layouts/MainLayout";
import { Button } from "primereact/button";
import AddSurveyField from "../../../components/page/surveys/AddSurveyField";
import CheckBoxField from "../../../components/page/surveys/surveyFields/CheckBoxField";
import RadioField from "../../../components/page/surveys/surveyFields/RadioField";
import TextField from "../../../components/page/surveys/surveyFields/TextField";
import SurveyField from "../../../components/page/surveys/surveyFields/SurveyField";

const Edit = () => {
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <Card className="relative mt-6">
          <Title className="text-2xl">Survey Title</Title>
          <Text className="text-sm">
            Survey Description This is a survey page
          </Text>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button icon="pi pi-eye" rounded text aria-label="Filter" />
            <Button icon="pi pi-share-alt" rounded text aria-label="Filter" />
            <Button icon="pi pi-pencil" rounded text aria-label="Filter" />
            <Button icon="pi pi-trash" rounded text aria-label="Filter" />
          </div>
        </Card>
        <SurveyField type="checkbox" />
        <SurveyField type="radio" />
        <SurveyField type="text" />
        <AddSurveyField />
      </main>
    </MainLayout>
  );
};

export default Edit;
