import React, { useContext, createContext } from "react";
import MainLayout from "../../../layouts/MainLayout";
import SurveyPage from "../../../components/page/surveys/SurveyPage";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getSurvey } from "../../../lib/apiCalls";
import { Survey } from "@prisma/client";

const SingleSurveyContext = createContext();

export const useSingleSurvey = () => useContext(SingleSurveyContext);

const Edit = () => {
  const router = useRouter();
  const { surveyId } = router.query;
  const {
    data: survey,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey>(["survey"], () => getSurvey(String(surveyId)));

  return (
    <SingleSurveyContext.Provider value={{ refetch, survey }}>
      <MainLayout>
        {!isLoading && !isError && survey && <SurveyPage info={survey} />}
      </MainLayout>
    </SingleSurveyContext.Provider>
  );
};

export default Edit;
