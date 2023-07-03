import React, { useContext, createContext } from "react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyPage from "../../../components/page/surveys/SurveyPage";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  getPollResponseById,
  getSurvey,
  getSurveyResponseById,
} from "../../../lib/apiCalls";
import { PollAnswer, type SurveyAnswer } from "@prisma/client";
import SurveyResponse from "../../../components/page/surveys/response/SurveyResponse";

const Index = () => {
  const router = useRouter();
  const { responseId } = router.query;
  const {
    data: answer,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PollAnswer>(["answer"], () =>
    getPollResponseById(String(responseId))
  );

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!isLoading && !isError && answer && <SurveyResponse answer={answer} />}
      </main>
    </MainLayout>
  );
};

export default Index;
