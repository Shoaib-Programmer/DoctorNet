"use server";

import { signOut } from "@/server/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut({ redirectTo: "/auth/signin" });
}
