import {
  DocumentAddIcon,
  HandIcon,
  PlusCircleIcon,
  SaveIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  Card,
  Title,
  Text,
  Badge,
  BadgeDelta,
  Flex,
  TextInput,
  Icon,
} from "@tremor/react";
import { Button } from "@tremor/react";
import { Button as PrimeButton } from "primereact/button";
import { Dropdown, DropdownItem } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Ripple } from "primereact/ripple";
import { MdSwapVerticalCircle } from "react-icons/md";

type checkboxOptions = {
  title: string;
};

const CreatePoll = () => {
  const [checkboxOptions, setCheckboxOptions] = React.useState<
    checkboxOptions[]
  >([
    {
      title: "Option 1",
    },
  ]);

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <Card className="relative mt-6">
        <div className="absolute top-4 right-4 flex gap-2">
          <PrimeButton icon="pi pi-eye" rounded text aria-label="Filter" />
          <PrimeButton
            icon="pi pi-share-alt"
            rounded
            text
            aria-label="Filter"
          />

          <PrimeButton icon="pi pi-trash" rounded text aria-label="Filter" />
          <Ripple />
        </div>
        <Title className="text-2xl">Create Poll</Title>

        <div className="mt-4 flex flex-col space-y-4">
          <InputText className="mt-2 w-full" placeholder="Poll question" />

          <InputText className="mt-2 w-full" placeholder="Helper text" />
        </div>

        <div className="mt-4 flex flex-col  space-y-2">
          {checkboxOptions.map((option, index) => (
            <Flex key={index} className="gap-2" justifyContent="between">
              <InputText
                key={index}
                className="mt-2 w-full"
                placeholder={option.title}
              />
              <Icon
                icon={SparklesIcon}
                variant="solid"
                size="md"
                className="cursor-pointer"
                color="violet"
                tooltip="Generate an option using AI"
              />
              <Button
                icon={TrashIcon}
                color="red"
                variant="secondary"
                onClick={() => {
                  const newCheckboxOptions = [...checkboxOptions];
                  newCheckboxOptions.splice(index, 1);
                  setCheckboxOptions(newCheckboxOptions);
                }}
              >
                Delete
              </Button>
            </Flex>
          ))}
          <Button
            icon={PlusCircleIcon}
            onClick={() => {
              setCheckboxOptions([
                ...checkboxOptions,
                { title: `Option ${checkboxOptions.length + 1}` },
              ]);
            }}
          >
            Add Option
          </Button>
        </div>

        <Flex className="mt-4 gap-2" justifyContent="end">
          <Button icon={PlusCircleIcon}>Save</Button>
        </Flex>
      </Card>
    </main>
  );
};

export default CreatePoll;
