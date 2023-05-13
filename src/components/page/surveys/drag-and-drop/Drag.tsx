import { Card, Icon } from "@tremor/react";
import { Draggable } from "react-beautiful-dnd";
import CheckBoxField from "../surveyFields/CheckBoxField";
import RadioField from "../surveyFields/RadioField";
import TextField from "../surveyFields/TextField";
import { Button } from "primereact/button";
import { MdDragIndicator } from "react-icons/md";

type DragProps = {
  id: string;
  index: number;
  type: string;
  children: React.ReactNode;
};

type SnapShot = {
  isDragging: boolean;
};

export const Drag = ({ id, type, index, ...props }: DragProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot: SnapShot) => {
        return (
          <Card
            ref={provided.innerRef}
            className={snapshot.isDragging ? "relative mt-6 bg-blue-50" : "relative mt-6"}
            {...provided.draggableProps}
            {...props}
          >
            {type === "checkbox" && <CheckBoxField provided={provided} />}
            {type === "radio" && <RadioField provided={provided} />}
            {type === "text" && <TextField provided={provided} />}
          </Card>
        );
      }}
    </Draggable>
  );
};
