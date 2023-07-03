import React, { useEffect } from "react";
import { Button } from "primereact/button";
import AddSurveyField from "./AddSurveyField";
import SurveyField from "./surveyFields/SurveyField";
import { Card, Title, Text } from "@tremor/react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "../../../lib/helpers";
import { type SurveyFeild, type Survey } from "@prisma/client";
import { useSingleSurvey } from "../../../pages/surveys/[surveyId]/edit";
import ShareModal from "./ShareModal";
import EditSurvey from "./EditSurvey";
import { deleteSurvey, reorderSurveyFields } from "../../../lib/apiCalls";
import { useToast } from "../../../Context/ToastContext";
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRouter } from "next/router";

type Resurlt = {
  source: {
    id: string;
    index: number;
  };
  destination: {
    id: string;
    index: number;
  };
};

const SurveyPage = () => {
  const [openShare, setOpenShare] = React.useState<boolean>(false);
  const { survey: info } = useSingleSurvey();
  const { refetch } = useCaseStudy();
  const [fields, setFields] = React.useState<SurveyFeild[]>(info.surveyField);
  const [editSurvey, setEditSurvey] = React.useState<boolean>(false);
  const showToast = useToast();
  const router = useRouter();

  useEffect(() => {
    setFields(info.surveyField);
  }, [info]);
  const handleDragEnd = (result: Resurlt) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const reorderedItems = reorder(
      [...fields],
      source.index,
      destination.index
    );
    reorderSurveyFields(info.id as string, { reorderedItems: reorderedItems })
      .then((res) => {
        setFields(reorderedItems);
        showToast("success", "Survey field reordered");
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
      });

    setFields(reorderedItems);
  };

  const accept = () => {
    deleteSurvey(info.id)
      .then((res) => {
        refetch();
        router.push("/surveys").catch((err) => console.log(err));
        showToast("success", "Survey deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
      });
  };

  const reject = () => {
    showToast("info", "You have rejected");
  };

  const confirm = () => {
    confirmDialog({
      message: "Are you sure you want to delete this survey?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept,
      reject,
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <ConfirmDialog />
      {openShare && <ShareModal setIsOpen={setOpenShare} isOpen={openShare} type="survey" />}
      {editSurvey && (
        <EditSurvey setIsOpen={setEditSurvey} isOpen={editSurvey} />
      )}
      <Card className="relative mt-6">
        <Title className="text-2xl">{info.title}</Title>
        <Text className="text-sm">{info.description}</Text>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button icon="pi pi-eye" rounded text aria-label="Filter" onClick={
            () => router.push(`/respond/survey/${info.id}?preview=true`).catch((err) => console.log(err))
          } />
          <Button
            icon="pi pi-share-alt"
            rounded
            text
            aria-label="Filter"
            onClick={() => setOpenShare(true)}
          />
          <Button
            icon="pi pi-pencil"
            rounded
            text
            aria-label="Filter"
            onClick={() => setEditSurvey(true)}
          />

          <Button
            icon="pi pi-trash"
            rounded
            text
            aria-label="Filter"
            onClick={confirm}
          />
        </div>
      </Card>
      <DragAndDrop onDragEnd={handleDragEnd}>
        <Drop id="droppable-id">
          {fields.map((surveyField, index) => (
            <Drag
              key={surveyField.id}
              type={surveyField.type}
              surveyField={surveyField}
              id={surveyField.id}
              index={index}
            >
              <div className="h-28 w-full border-2">{surveyField.title}</div>
            </Drag>
          ))}
        </Drop>
      </DragAndDrop>
      <AddSurveyField />
    </main>
  );
};

export default SurveyPage;
