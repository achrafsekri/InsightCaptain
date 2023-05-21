import { createContext, useContext, useEffect, useState } from "react";

import { getCaseStudies } from "../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/global/Loading";
import { type CaseStudy } from "@prisma/client";
import { useUser } from "../auth/UserContext";
import { useOrganization } from "./OrganizationContext";

interface CaseStudyContextType {
  caseStudies: CaseStudy[] | undefined;
  refetch: () => void;
}

type CaseStudyProviderProps = {
  children: React.ReactNode;
};

export const CaseStudyContext = createContext({
  caseStudies: [] as CaseStudy[],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetch: () => {},
});

export const CaseStudyProvider = ({ children }: CaseStudyProviderProps) => {
  const { currentOrganization } = useOrganization();
  const {
    data: caseStudies,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["caseStudies"], () => getCaseStudies(currentOrganization.id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log("Error fetching case studies", error);
    return <div>Error</div>;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <CaseStudyContext.Provider value={{ caseStudies, refetch }}>
      {children}
    </CaseStudyContext.Provider>
  );
};

export const useCaseStudy = (): CaseStudyContextType =>
  useContext(CaseStudyContext);
