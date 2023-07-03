import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyTable from "../../../components/page/caseStudies/caseStudyPage/SurveyTable";
import { useRouter } from "next/router";
import { Survey } from "@prisma/client";
import { getSurveysByCaseStudy } from "../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";

const surveys = () => {
  const { caseStudyId } = useRouter().query;
  const {
    data: surveys,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey[]>(["surveys"], () =>
    getSurveysByCaseStudy(caseStudyId as string)
  );
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {!isLoading && !isError && (
          <SurveyTable refetch={refetch} surveys={surveys} />
        )}
      </main>
    </MainLayout>
  );
};

export default surveys;
