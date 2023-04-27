import React, { useEffect } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/router";

const OrganizationWrapper = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    if (!user?.organizations || user.organizations.length === 0) {
      void router.push("/organization");
    }
  }, [user]);
  return <>{children}</>;
};

export default OrganizationWrapper;
