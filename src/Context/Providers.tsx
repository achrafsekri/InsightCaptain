import React from "react";
import { CaseStudyProvider } from "./CaseStudyContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CaseStudyProvider>{children}</CaseStudyProvider>
    </>
  );
};

export default Providers;
