import React from "react";
import { CaseStudyProvider } from "./CaseStudyContext";
import { useUser } from "../auth/UserContext";
import { OrganizationProvider } from "./OrganizationContext";
import { ToastProvider } from "./ToastContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <>
        {user?.organizations.length > 0 && (
          <OrganizationProvider>
            <CaseStudyProvider>{children}</CaseStudyProvider>
          </OrganizationProvider>
        )}
        {user?.organizations.length == 0 && <>{children}</>}

    </>
  );
};

export default Providers;
