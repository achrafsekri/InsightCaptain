import { createContext, useContext, useEffect, useState } from "react";
import { type Organization } from "@prisma/client";
import { useUser } from "../auth/UserContext";
import Loading from "../components/global/Loading";

interface OrganizationContextType {
  currentOrganization: Organization;
  setCurrentOrganization: (organization: Organization) => void;
}

export const OrganizationContext = createContext({
  currentOrganization: {} as Organization,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentOrganization: (organization: Organization) => {},
});

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  useEffect(() => {
    setLoading(true);
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
    setLoading(false);
  }, [user.organizations]);

  if (loading) {
    return <Loading />;
  }
  return (
    <OrganizationContext.Provider
      value={
        {
          currentOrganization,
          setCurrentOrganization,
        } as OrganizationContextType
      }
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType =>
  useContext(OrganizationContext);
