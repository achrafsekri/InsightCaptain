import { createContext, useContext, useEffect, useState } from "react";
import { SessionContextValue, useSession } from "next-auth/react";
import type { userOrganization } from "@prisma/client";
import { getUser } from "../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/global/loading";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  organizations: userOrganization;
}

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext({ user: null });

export const UserProvider: React.FC = ({ children }) => {
  const session = useSession() as SessionContextValue;
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(["user"], () => getUser(session?.data?.user.id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log("Error fetching user data");
    return <div>Error</div>;
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextType => useContext(UserContext);
