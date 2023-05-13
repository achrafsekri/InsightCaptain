import { Card, Icon, Text } from "@tremor/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import EditCheckBoxField from "./EditCheckBoxField";
import { RxDragHandleDots2 } from "react-icons/rx";

type Provided = {
  innerRef: any;
  draggableProps: any;
  dragHandleProps: any;
};

type CheckBoxFieldProps = {
  provided: Provided;
};

const checkBoxOptions = [
  { label: "Cheese", value: "Cheese" },
  { label: "Pepperoni", value: "Pepperoni" },
  { label: "Mushroom", value: "Mushroom" },
];

const CheckBoxField = ({ provided }: CheckBoxFieldProps) => {
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
            How do you like your pizza?
          </Text>
          <Text className="text-sm">
            Pizza is eaten different accross multiple people How do you like
            your pizza?{" "}
          </Text>
          <div className="mt-6 flex flex-col gap-3">
            {checkBoxOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <Checkbox
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
      {edit && <EditCheckBoxField setEdit={setEdit} />}
    </>
  );
};

export default CheckBoxField;
