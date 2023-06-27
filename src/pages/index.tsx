import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "primereact/button";
import MainLayout from "../layouts/MainLayout";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <MainLayout>
      <div>
        feez
      </div>
      
    </MainLayout>
  );
};

export default Home;
