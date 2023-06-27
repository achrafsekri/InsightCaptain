import { Card, Icon } from "@tremor/react";
import { Draggable } from "react-beautiful-dnd";
import CheckBoxField from "../surveyFields/CheckBoxField";
import RadioField from "../surveyFields/RadioField";
import TextField from "../surveyFields/TextField";
import { Button } from "primereact/button";
import { MdDragIndicator } from "react-icons/md";
import { SurveyFeild } from "@prisma/client";

type DragProps = {
  id: string;
  index: number;
  type: string;
  children: React.ReactNode;
  surveyField: SurveyFeild;
};

type SnapShot = {
  isDragging: boolean;
};

export const Drag = ({ id, type, index, surveyField, ...props }: DragProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot: SnapShot) => {
        return (
          <Card
            ref={provided.innerRef}
            className={
              snapshot.isDragging ? "relative mt-6 bg-blue-50" : "relative mt-6"
            }
            {...provided.draggableProps}
            {...props}
          >
            {type === "CHECKBOX" && (
              <CheckBoxField provided={provided} data={surveyField} />
            )}
            {type === "RADIO" && (
              <RadioField provided={provided} data={surveyField} />
            )}
            {type === "TEXT" && (
              <TextField provided={provided} data={surveyField}  />
            )}
          </Card>
        );
      }}
    </Draggable>
  );
};
