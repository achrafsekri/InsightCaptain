import React, { useEffect } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

const OrganizationWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    if (!user?.organizations || user.organizations.length === 0) {
      void router.push("/organization");
    }
  }, [user,router]);
  return <>{children}</>;
};

export default OrganizationWrapper;
