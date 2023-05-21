import { signIn, signOut, useSession } from "next-auth/react";
import Loading from "../components/global/Loading";
import React from "react";
import { useRouter } from "next/router";
import { publicRoutes } from "../shared/constants";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: Props) => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") {
    return <Loading />;
  }
  if (
    session.status === "unauthenticated" &&
    !publicRoutes.includes(router.pathname)
  ) {
    signIn().catch(() => {
      console.log("Sign in failed");
    });
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
