import { createContext, useContext, useEffect, useState } from "react";
import { type Organization } from "@prisma/client";
import { useUser } from "../auth/UserContext";

interface OrganizationContextType {
  currentOrganization: Organization;
  setCurrentOrganization: (organization: Organization) => void;
}
type Value = {
  currentOrganization: Organization;
  setCurrentOrganization: (organization: Organization) => void;
};

export const OrganizationContext = createContext({
  currentOrganization: {} as Organization,
  setCurrentOrganization: (organization: Organization) => {},
});

export const OrganizationProvider: React.FC = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("currentOrganization") as string) !== null
    ) {
      setCurrentOrganization(
        JSON.parse(
          localStorage.getItem("currentOrganization") as string
        ) as Organization
      );
    } else {
      user.organizations &&
        setCurrentOrganization(
          user.organizations[0]?.organization as Organization
        );
    }
  }, [user]);
  return (
    <OrganizationContext.Provider
      value={{ currentOrganization, setCurrentOrganization } as Value}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType =>
  useContext(OrganizationContext);
