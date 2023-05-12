import { signIn, signOut, useSession } from "next-auth/react";
import Loading from "../components/global/loading";
import React from "react";
import { useRouter } from "next/router";
import { publicRoutes } from "../shared/constants";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") {
    return <Loading />;
  }
  if (
    session.status === "unauthenticated" &&
    !publicRoutes.includes(router.pathname)
  ) {
    signIn();
    return <div>Redirecting...</div>;
  }
  if (
    session.status === "authenticated" ||
    publicRoutes.includes(router.pathname)
  ) {
    return <>{children}</>;
  }
};

export default AuthWrapper;
