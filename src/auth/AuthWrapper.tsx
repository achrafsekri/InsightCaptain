import { signIn, signOut, useSession } from "next-auth/react";
import Loading from "../components/global/loading";
import React from "react";

const AuthWrapper = ({ children }) => {
  const session = useSession();
  if (session.status === "loading") {
    return <Loading />;
  }
  if (session.status === "unauthenticated") {
    signIn();
    return <div>Redirecting...</div>;
  }
  if (session.status === "authenticated") {
    return <>{children}</>;
  }
};

export default AuthWrapper;
