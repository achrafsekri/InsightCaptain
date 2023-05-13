import { Card, Text,Icon } from "@tremor/react";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import React from "react";
import EditRadioField from "./EditRadioField";
import { RxDragHandleDots2 } from "react-icons/rx";

type Provided = {
  innerRef: any;
  draggableProps: any;
  dragHandleProps: any;
};

type RadioFieldProps = {
  provided: Provided;
};

const RadioOptions = [
  { label: "Cheese", value: "Cheese" },
  { label: "Pepperoni", value: "Pepperoni" },
  { label: "Mushroom", value: "Mushroom" },
];

const RadioField = ({ provided }: RadioFieldProps) => {
  const [edit, setEdit] = React.useState<boolean>(false);
  return (
    <>
      {!edit && (
        <>
          <div className="absolute  top-4 right-4 flex items-center justify-center gap-2">
            <div {...provided.dragHandleProps}>
              <Icon icon={RxDragHandleDots2} tooltip="Reorder fields" />
            </div>
            <Button
              icon="pi pi-pencil"
              rounded
              text
              aria-label="Filter"
              onClick={() => setEdit(true)}
            />
          </div>
          <Text className="mt-4 text-lg font-bold text-gray-800">
            How do you like your shawarma?
          </Text>
          <Text className="text-sm">
            Pizza is eaten different accross multiple people How do you like
            your pizza?{" "}
          </Text>
          <div className="mt-6 flex flex-col gap-3">
            {RadioOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <RadioButton
                  inputId={option.value}
                  name={option.label}
                  checked={false}
                  value={option.value}
                />
                <label
                  htmlFor={option.value}
                  className="text-md ml-2 font-medium text-gray-600"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
      {edit && <EditRadioField setEdit={setEdit} />}
    </>
  );
};

export default RadioField;
