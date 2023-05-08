import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { Card, Flex, Text, TextInput } from "@tremor/react";
import { Button } from "@tremor/react";
import React from "react";

type RadioOptions = {
  title: string;
};

const EditRadioField = ({ setEdit }) => {
  const [radioOptions, setRadioOptions] = React.useState<
    RadioOptions[]
  >([
    {
      title: "Option 1",
    },
  ]);

  return (
    <Card className="relative mt-6">
      <TextInput className="mt-2" placeholder="Field Title" />
      <TextInput className="mt-4" placeholder="Field Description" />
      <div className="mt-4 flex flex-col gap-2 space-y-2">
        <Text className="text-lg font-semibold text-gray-600">Options</Text>
        {radioOptions.map((option, index) => (
          <Flex key={index} className="mt-4 gap-2" justifyContent="between">
            <TextInput
              key={index}
              className=" w-full"
              placeholder={option.title}
            />
            <Button
              icon={TrashIcon}
              color="red"
              variant="secondary"
              onClick={() => {
                const newradioOptions = [...radioOptions];
                newradioOptions.splice(index, 1);
                setRadioOptions(newCheckboxOptions);
              }}
            >
              Delete
            </Button>
          </Flex>
        ))}
        <Button
          icon={PlusCircleIcon}
          onClick={() => {
            setRadioOptions([
              ...radioOptions,
              { title: `Option ${radioOptions.length + 1}` },
            ]);
          }}
        >
          Add Option
        </Button>
      </div>

      <Flex className="mt-4 gap-2" justifyContent="end">
        <Button
          color="red"
          variant="secondary"
          onClick={() => console.log("clicked")}
        >
          Cancel
        </Button>
        <Button icon={PlusCircleIcon} onClick={() => setEdit(false)}>
          Save Field
        </Button>
      </Flex>
    </Card>
  );
};

export default EditRadioField;
