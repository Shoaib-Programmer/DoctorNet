"use client";

import { Sidebar } from "@/components/sidebar";
import { OnboardingProvider } from "@/components/onboarding-provider";
import { logoutAction } from "@/app/actions/auth";

interface DashboardLayoutClientProps {
	userName?: string | null;
	children: React.ReactNode;
}

export function DashboardLayoutClient({
	userName,
	children,
}: DashboardLayoutClientProps) {
	const handleLogout = async () => {
		await logoutAction();
	};

	return (
		<OnboardingProvider>
			<div className="flex h-screen w-screen">
				<Sidebar userName={userName} onLogout={handleLogout} />
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</OnboardingProvider>
	);
}
