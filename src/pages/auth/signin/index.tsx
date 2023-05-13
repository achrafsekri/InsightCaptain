import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, useSession } from "next-auth/react";
import { Button } from "@tremor/react";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import Logo from "../../../shared/Logo";
import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { useRouter } from "next/router";

export default function Index({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/").catch((err) => console.log(err));
    }
  }, [session, router]);
  return (
    <div className="flex h-screen w-screen">
      {/* <div className="flex-1 bg-blue-600">
        <div className="flex h-screen flex-col items-center justify-center p-10 text-center text-white">
          <div className="text-900 mb-5 text-4xl font-semibold ">
            Welcome to insightPilot
          </div>
          <div className=" mb-5 text-xl">
            insightPilot is a platform for collecting and managing client
            feedback. It is a tool for you to use with your clients to help you
            understand their needs and improve your service.
          </div>
        </div>
      </div> */}
      <div className="lg:px-112 relative hidden h-full flex-auto items-center justify-center overflow-hidden bg-blue-600 p-32 md:flex">
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <svg
            className="bg-white opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </svg>
        </svg>
        <svg
          className="absolute -top-64 -right-64 bg-white opacity-20"
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </svg>

        <div className="relative z-10 w-full max-w-3xl">
          <div className="text-6xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>where magic is created</div>
          </div>
          <div className="mt-24 text-lg leading-6 tracking-tight text-gray-100">
            insightPilot is a platform for collecting and managing client
            feedback. It is a tool for you to use with your clients to help you
            understand their needs and improve your service.
          </div>
          <div className="mt-32 flex items-center">
            <AvatarGroup>
              <Avatar
                size="large"
                shape="circle"
                image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&w=1000&q=80"
              />
              <Avatar
                size="large"
                shape="circle"
                image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
              />
              <Avatar
                size="large"
                shape="circle"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyttEPQ_Vw42N9IpA2rdaPKbEMO3eKqvz6tQcv5I9D&s"
              />
              <Avatar
                size="large"
                shape="circle"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-BOyLuSIarGrjUBxC1NHPZnqmZKJHpQ-nTsX3zSt5zGPJ3TRatL2YED-waneB9WJ1neM&usqp=CAU"
              />
            </AvatarGroup>

            <div className="ml-4 font-medium tracking-tight text-gray-100">
              People love us , bet you&apos;ll do too!
            </div>
          </div>
        </div>
      </div>
      <div className="surface-card shadow-2 border-round flex h-screen flex-auto flex-col justify-center px-20 ">
        <div className="mb-5 text-left">
          <Logo />
          <div className="text-900 mb-2 text-3xl font-medium">Welcome Back</div>
          <p className="text-500 text-sm italic">
            Enter your email address then check your inbox for a magic link that
            will sign you in instantly.
          </p>
        </div>
        <form
          method="post"
          onSubmit={() => setLoading(true)}
          action="/api/auth/signin/email"
        >
          <div className="flex flex-col gap-4">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label htmlFor="email" className="text-900 block font-medium">
              Email
            </label>
            <InputText
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              className="mb-3 w-full"
            />

            <Button
              loading={loading}
              className="mt-6 w-full bg-blue-600"
              type="submit"
            >
              {" "}
              Sign in with Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

{
  /* <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" />
      </label>
      <button type="submit">Sign in with Email</button> */
}
