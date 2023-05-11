import React from "react";
import { CaseStudyProvider } from "./CaseStudyContext";
import { useUser } from "../auth/UserContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <>
      {user?.organizations.length > 0 && (
        <CaseStudyProvider>{children}</CaseStudyProvider>
      )}
      {user?.organizations.length == 0 && <>{children}</>}
    </>
  );
};

export default Providers;
