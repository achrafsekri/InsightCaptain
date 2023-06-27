import React from "react";
import MainLayout from "../../../layouts/MainLayout";

import PollTopAnalytics from "../../../components/page/polls/PollTopAnalytics";
import { getPollById } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Poll } from "@prisma/client";

const Index = () => {
  const router = useRouter();
  const { pollId } = router.query;
  const {
    data: poll,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Poll>(["poll"], () => getPollById(String(pollId)));
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!isLoading && !isError && poll && <PollTopAnalytics data={poll} />}
      </main>
    </MainLayout>
  );
};

export default Index;
