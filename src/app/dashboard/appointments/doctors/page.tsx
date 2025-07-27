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
