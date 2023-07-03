import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "primereact/button";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../components/page/home/HomePage";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
};

export default Home;
