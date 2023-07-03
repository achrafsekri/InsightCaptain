import { createContext, useContext, useEffect, useState } from "react";
import { SessionContextValue, useSession } from "next-auth/react";
import type { User, userOrganization } from "@prisma/client";
import { getUser } from "../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/global/Loading";

interface UserContextType {
  user: User;
}

type Props = {
  children: React.ReactNode;
};

export const UserContext = createContext({ user: {} } as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const { data: session } = useSession() as SessionContextValue;
  const {
    data: user,
    isLoading,
    refetch,
    isError,
  } = useQuery(["user"], () => getUser(session?.user.id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log("Error fetching user data");
    return <div>Error</div>;
  }

  return (
    <UserContext.Provider value={{ user, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => useContext(UserContext);
