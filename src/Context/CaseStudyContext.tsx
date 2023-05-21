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
  refetch: () => {},
});

export const CaseStudyProvider = ({ children }: CaseStudyProviderProps) => {
  const { currentOrganization } = useOrganization();
  console.log(currentOrganization);
  const {
    data: caseStudies,
    isLoading,
    isError,
    refetch,
  } = useQuery(["caseStudies"], () => getCaseStudies(currentOrganization.id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log("Error fetching user data");
    return <div>Error</div>;
  }

  return (
    <CaseStudyContext.Provider value={{ caseStudies, refetch }}>
      {children}
    </CaseStudyContext.Provider>
  );
};

export const useCaseStudy = (): CaseStudyContextType =>
  useContext(CaseStudyContext);
