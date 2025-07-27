"use client";

import { Sidebar } from "@/components/sidebar";
import { logoutAction } from "@/app/actions/auth";

interface DashboardClientProps {
  userName?: string | null;
}

export function DashboardClient({ userName }: DashboardClientProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return <Sidebar userName={userName} onLogout={handleLogout} />;
}
