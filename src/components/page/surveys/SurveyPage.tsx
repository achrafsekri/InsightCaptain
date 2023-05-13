import React from "react";
import { Button } from "primereact/button";
import AddSurveyField from "./AddSurveyField";
import SurveyField from "./surveyFields/SurveyField";
import { Card, Title, Text } from "@tremor/react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "../../../lib/helpers";

type Resurlt = {
  source: {
    id: string;
    index: number;
  };
  destination: {
    id: string;
    index: number;
  };
};

const surveyFields = [
  {
    id: "abc",
    type: "checkbox",
    label: "Checkbox",
  },
  {
    id: "hsd",
    type: "radio",
    label: "Radio",
  },
  {
    id: "ledh",
    type: "text",
    label: "Text",
    options: [],
  },
];

const SurveyPage = () => {
  const [fields, setFields] = React.useState(surveyFields);
  const handleDragEnd = (result: Resurlt) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const reorderedItems = reorder(
      [...fields],
      source.index,
      destination.index
    );

    setFields(reorderedItems);
  };

  console.log(fields);

  return (
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
      <DragAndDrop onDragEnd={handleDragEnd}>
        <Drop id="droppable-id">
          {fields.map((surveyField, index) => (
            <Drag
              key={surveyField.id}
              type={surveyField.type}
              id={surveyField.id}
              index={index}
            >
              <div className="h-28 w-full border-2">{surveyField.label}</div>
            </Drag>
          ))}
        </Drop>
      </DragAndDrop>
      <AddSurveyField />
    </main>
  );
};

export default SurveyPage;
