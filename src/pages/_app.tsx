import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AuthWrapper from "../auth/AuthWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "../auth/UserContext";
import "../theme/theme.css";
import "../styles/globals.css";
import "primeicons/primeicons.css";
import OrganizationWrapper from "../auth/OrganizationWrapper";
import Providers from "../Context/Providers";
import PrimeReact from "primereact/api";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { publicRoutes } from "../shared/constants";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  PrimeReact.appendTo = "self";
  PrimeReact.ripple = true;
  const queryClient = new QueryClient();
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AuthWrapper>
          {!publicRoutes.includes(router.pathname) && (
            <UserProvider>
              <OrganizationWrapper>
                <Providers>
                  <Component {...pageProps} />
                  <ReactQueryDevtools initialIsOpen={false} />
                </Providers>
              </OrganizationWrapper>
            </UserProvider>
          )}
          {publicRoutes.includes(router.pathname) && (
            <Component {...pageProps} />
          )}
        </AuthWrapper>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
