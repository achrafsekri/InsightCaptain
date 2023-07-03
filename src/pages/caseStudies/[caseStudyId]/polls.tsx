import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import PollTable from "../../../components/page/caseStudies/caseStudyPage/PollTable";
import { getPollsByCaseStudy } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { Poll } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const Polls = () => {
  const { caseStudyId } = useRouter().query;
  const {
    data: polls,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Poll[]>(["statistics"], () =>
    getPollsByCaseStudy(caseStudyId as string)
  );
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!isLoading && !isError && (
          <PollTable polls={polls} refetch={refetch} />
        )}
      </main>
    </MainLayout>
  );
};

export default Polls;
