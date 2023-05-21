import React from "react";
import { CaseStudyProvider } from "./CaseStudyContext";
import { useUser } from "../auth/UserContext";
import { OrganizationProvider } from "./OrganizationContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <>
      {user.organizations && user?.organizations.length > 0 && (
        <OrganizationProvider>
          <CaseStudyProvider>{children}</CaseStudyProvider>
          {children}
        </OrganizationProvider>
      )}
      {user.organizations && user?.organizations.length == 0 && <>{children}</>}
    </>
  );
};

export default Providers;
