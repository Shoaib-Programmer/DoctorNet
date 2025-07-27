"use client";

import { DoctorsList } from "@/components/doctors/DoctorsList";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorsPage() {
	const router = useRouter();

	// Fetch doctors
	const { data: doctors, isLoading } = api.doctor.getAllDoctors.useQuery();

	const handleBookAppointment = (doctorId: string) => {
		router.push(`/dashboard/appointments/book/${doctorId}`);
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center space-x-4 mb-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleGoBack}
								className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								Back to Appointments
							</Button>
						</div>
						<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
							Choose a Doctor
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Select a healthcare provider to book your appointment
						</p>
					</div>

					{/* Demo Warning Banner */}
					<div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0">
								<svg
									className="w-5 h-5 text-amber-600 dark:text-amber-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
									Demo Feature Notice
								</h3>
								<p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
									These are sample doctors for demonstration purposes. No real
									appointments can be booked through this system.
								</p>
							</div>
						</div>
					</div>

					{/* Doctors List */}
					<DoctorsList
						doctors={doctors || []}
						onBookAppointment={handleBookAppointment}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
}
