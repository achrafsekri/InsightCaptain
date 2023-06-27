import { Card, Icon, Text } from "@tremor/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import EditSurveyField from "./EditSurveyField";
import { RxDragHandleDots2 } from "react-icons/rx";
import { SurveyFeild } from "@prisma/client";
import { deleteSurveyField } from "../../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useSingleSurvey } from "../../../../pages/surveys/[surveyId]/edit";

type Provided = {
  innerRef: any;
  draggableProps: any;
  dragHandleProps: any;
};

type CheckBoxFieldProps = {
  provided: Provided;
  data: SurveyFeild;
};

const CheckBoxField = ({ provided, data }: CheckBoxFieldProps) => {
  const router = useRouter();
  const { surveyId } = router.query;
  const { refetch } = useSingleSurvey();
  const [edit, setEdit] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleDelete = () => {
    setLoading(true);
    deleteSurveyField(data.id as string, surveyId as string)
      .then(() => {
        refetch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
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
            <Button
              icon="pi pi-trash"
              rounded
              text
              aria-label="delete"
              onClick={handleDelete}
              loading={loading}
            />
          </div>
          <Text className="mt-4 text-lg font-bold text-gray-800">
            {data.title}
          </Text>
          <Text className="text-sm">{data.helperText}</Text>
          <div className="mt-6 flex flex-col gap-3">
            {data.surveyFeildOption.map((option, index) => (
              <div key={index} className="flex items-center">
                <Checkbox
                  inputId={option.title}
                  name={option.title}
                  checked={false}
                  value={option.title}
                />
                <label
                  htmlFor={option.title}
                  className="text-md ml-2 font-medium text-gray-600"
                >
                  {option.title}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
      {edit && <EditSurveyField setEdit={setEdit} data={data} />}
    </>
  );
};

export default CheckBoxField;
