import Nav from "../components/global/Nav";
import { Suspense } from "react";

export const metadata = {
  title: "Next.js 13 + PlanetScale + NextAuth + Tailwind CSS",
  description:
    "A user admin dashboard configured with Next.js, PlanetScale, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen bg-gray-50 overflow-auto">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
