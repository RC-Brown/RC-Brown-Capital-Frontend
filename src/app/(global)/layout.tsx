import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <main>{children}</main>;
}
