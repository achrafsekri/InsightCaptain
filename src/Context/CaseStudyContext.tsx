import { createContext, useContext, useEffect, useState } from "react";
import { SessionContextValue, useSession } from "next-auth/react";
import type { userOrganization } from "@prisma/client";
import { getCaseStudies } from "../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/global/loading";
import { type CaseStudy } from "@prisma/client";
import { useUser } from "../auth/UserContext";

interface CaseStudyContextType {
  caseStudies: CaseStudy | null;
  refetch: () => void;
}

export const CaseStudyContext = createContext({
  caseStudies: null,
  refetch: () => {},
});

export const CaseStudyProvider: React.FC = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useUser();
  const {
    data: caseStudies,
    isLoading,
    isError,
    refetch,
  } = useQuery(["caseStudies"], () =>
    getCaseStudies(user.user.organizations[0].organizationId as string)
  );

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
