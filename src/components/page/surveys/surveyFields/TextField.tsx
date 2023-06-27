import { Text, Icon } from "@tremor/react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
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

type TextFieldProps = {
  provided: Provided;
  data: SurveyFeild;
};

const TextField = ({ provided, data }: TextFieldProps) => {
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
              loading={loading}
              text
              aria-label="delete"
              onClick={handleDelete}
            />
          </div>
          <Text className="mt-4 text-lg font-bold text-gray-800">
            {data.title}
          </Text>
          <Text className="mb-4 text-sm">{data.helperText}</Text>
          <InputTextarea
            autoResize
            onChange={(e) => console.log(e.target.value)}
            rows={5}
            cols={30}
            className="w-full "
          />
        </>
      )}
      {edit && <EditSurveyField setEdit={setEdit} data={data} />}
    </>
  );
};

export default TextField;
