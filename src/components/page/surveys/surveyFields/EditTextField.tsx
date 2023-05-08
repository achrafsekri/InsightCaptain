import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { Card, Flex, Text, TextInput } from "@tremor/react";
import { Button } from "@tremor/react";
import React from "react";

type RadioOptions = {
  title: string;
};

const EditTextField = ({ setEdit }) => {
  const [radioOptions, setRadioOptions] = React.useState<RadioOptions[]>([
    {
      title: "Option 1",
    },
  ]);

  return (
    <Card className="relative mt-6">
      <TextInput className="mt-2" placeholder="Field Title" />
      <TextInput className="mt-4" placeholder="Field Description" />

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

export default EditTextField;
