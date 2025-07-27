import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayoutClient userName={session.user.name}>
      {children}
    </DashboardLayoutClient>
  );
}
