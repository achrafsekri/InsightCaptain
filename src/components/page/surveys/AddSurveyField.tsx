import {
  DocumentAddIcon,
  HandIcon,
  PlusCircleIcon,
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

type checkboxOptions = {
  title: string;
};

const options = [
  {
    name: "Text",
    value: "Text",
  },
  {
    name: "Checkbox",
    value: "Checkbox",
  },
  {
    name: "Radio",
    value: "Radio",
  },
];

const SurveyField = () => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [checkboxOptions, setCheckboxOptions] = React.useState<
    checkboxOptions[]
  >([
    {
      title: "Option 1",
    },
  ]);

  const [radioOptions, setRadioOptions] = React.useState<checkboxOptions[]>([
    {
      title: "Option 1",
    },
  ]);

  const [addSurveyField, setAddSurveyField] = React.useState<boolean>(false);

  return (
    <>
      {addSurveyField && (
        <Card className="relative mt-6">
          <Title className="text-2xl">Create survey fields</Title>

          <Flex className="mt-4 gap-4" justifyContent="end">
            <Flex className="gap-1" alignItems="end">
              <TextInput className="mt-2" placeholder="Field Title" />
              <Icon
                icon={SparklesIcon}
                variant="solid"
                size="md"
                className="cursor-pointer"
                color="violet"
                tooltip="Generate a field title using AI"
              />
              <Ripple />
            </Flex>
            <Dropdown
              className="mt-2"
              onValueChange={(value) => setSelectedOption(value)}
              placeholder="Feild Type"
            >
              {options.map((option, index) => (
                <DropdownItem
                  key={index}
                  value={option.value}
                  text={option.name}
                />
              ))}
            </Dropdown>
          </Flex>
          {selectedOption === "Checkbox" ? (
            <div className="mt-4 flex flex-col gap-2 space-y-2">
              {checkboxOptions.map((option, index) => (
                <Flex key={index} className="gap-2" justifyContent="between">
                  <InputText
                    key={index}
                    className="mt-2 w-full"
                    placeholder={option.title}
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
          ) : null}
          {selectedOption === "Radio" ? (
            <div className="mt-4 flex flex-col gap-2 space-y-2">
              {radioOptions.map((option, index) => (
                <Flex key={index} className="gap-2" justifyContent="between">
                  <InputText
                    key={index}
                    className="mt-2 w-full"
                    placeholder={option.title}
                  />
                  <Button
                    icon={TrashIcon}
                    color="red"
                    variant="secondary"
                    onClick={() => {
                      const newRadioOptions = [...radioOptions];
                      newRadioOptions.splice(index, 1);
                      setRadioOptions(newRadioOptions);
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
                Delete
              </Button>
            </div>
          ) : null}
          <Flex className="mt-4 gap-2" justifyContent="end">
            <Button
              color="red"
              variant="secondary"
              onClick={() => setAddSurveyField(false)}
            >
              Cancel
            </Button>
            <Button
              icon={PlusCircleIcon}
              onClick={() => setAddSurveyField(false)}
            >
              Save Field
            </Button>
          </Flex>
        </Card>
      )}
      {!addSurveyField && (
        <div className="my-6 flex justify-center">
          <Button icon={PlusCircleIcon} onClick={() => setAddSurveyField(true)}>
            Add Field
          </Button>
        </div>
      )}
    </>
  );
};

export default SurveyField;
