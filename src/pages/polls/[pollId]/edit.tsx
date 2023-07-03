import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyPage from "../../../components/page/surveys/SurveyPage";
import CreatePoll from "../../../components/page/polls/CreatePoll";
import { Card, Title, Text, Icon } from "@tremor/react";
import { Button } from "primereact/button";
import { deletePoll, getPollById } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { type Poll } from "@prisma/client";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../../Context/ToastContext";
import EditPoll from "../../../components/page/polls/EditPoll";
import ShareModal from "../../../components/page/surveys/ShareModal";
import Link from "next/link";
import { BackspaceIcon } from "@heroicons/react/outline";

const Edit = () => {
  const router = useRouter();
  const { pollId } = router.query;
  const showToast = useToast();
  const [openShare, setOpenShare] = React.useState<boolean>(false);
  const [editPoll, setEditPoll] = React.useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false);
  const {
    data: poll,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Poll>(["poll"], () => getPollById(String(pollId)));
  const accept = () => {
    setLoadingDelete(true);
    deletePoll(pollId as string)
      .then((res) => {
        router.push("/polls").catch((err) => console.log(err));
        setLoadingDelete(false);
        showToast("success", "Survey deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        setLoadingDelete(false);
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
    <MainLayout>
      {editPoll && (
        <EditPoll
          isOpen={editPoll}
          setIsOpen={setEditPoll}
          poll={poll as Poll}
          refetch={refetch}
        />
      )}
      {openShare && (
        <ShareModal setIsOpen={setOpenShare} isOpen={openShare} type="poll" />
      )}
      <ConfirmDialog />
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!isLoading && !isError && poll && (
          <Card className="relative mt-6">
            <Link
              href={`/polls/${pollId as string}`}
              className="-ml-2 mb-1 flex cursor-pointer items-center text-sm font-semibold text-blue-500 "
            >
              <Icon className="h-6 w-6" icon={BackspaceIcon} />
              Back to stats
            </Link>
            <Title className="text-2xl font-bold capitalize">
              {poll.title}
            </Title>
            <Text className="text-sm">{poll.description}</Text>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                icon="pi pi-eye"
                rounded
                text
                aria-label="Filter"
                onClick={() => {
                  router
                    .push(`/respond/poll/${poll.id}?preview=true`)
                    .catch((err) => console.log(err));
                }}
              />
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
                onClick={() => setEditPoll(true)}
              />

              <Button
                icon="pi pi-trash"
                rounded
                text
                aria-label="Filter"
                onClick={confirm}
                loading={loadingDelete}
              />
            </div>
          </Card>
        )}
        {!isLoading && !isError && poll && (
          <CreatePoll data={poll} refetch={refetch} />
        )}
      </main>
    </MainLayout>
  );
};

export default Edit;
