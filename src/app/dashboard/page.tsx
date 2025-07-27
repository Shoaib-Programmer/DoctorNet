import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { DashboardClient } from "@/components/dashboard-client";

const Dashboard = async () => {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen w-screen">
      <DashboardClient userName={session.user.name} />
    </div>
  );
};

export default Dashboard;
