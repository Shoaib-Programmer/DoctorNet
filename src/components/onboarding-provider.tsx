"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { OnboardingModal } from "./onboarding-modal";

interface OnboardingProviderProps {
	children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { data: onboardingCompleted, refetch: refetchOnboardingStatus } =
		api.user.checkOnboardingStatus.useQuery(undefined, {
			retry: 1,
		});

	useEffect(() => {
		if (onboardingCompleted !== undefined) {
			setShowOnboarding(!onboardingCompleted);
			setIsLoading(false);
		}
	}, [onboardingCompleted]);

	const handleOnboardingComplete = async () => {
		setShowOnboarding(false);
		await refetchOnboardingStatus();
	};

	// Show loading state while checking onboarding status
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-400">
						Loading your profile...
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{children}
			<OnboardingModal
				isOpen={showOnboarding}
				onComplete={handleOnboardingComplete}
			/>
		</>
	);
}
