"use client";

import { useState } from "react";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Appointments() {
	const router = useRouter();
	const [showNegotiateModal, setShowNegotiateModal] = useState<string | null>(
		null,
	);

	// Fetch appointments
	const {
		data: appointments,
		isLoading,
		refetch,
	} = api.appointment.getMyAppointments.useQuery();

	// Mutations
	const cancelMutation = api.appointment.cancelAppointment.useMutation({
		onSuccess: () => {
			toast.success("Demo appointment cancelled successfully");
			void refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to cancel demo appointment");
		},
	});

	const updateStatusMutation =
		api.appointment.updateAppointmentStatus.useMutation({
			onSuccess: () => {
				toast.success("Demo appointment confirmed successfully");
				void refetch();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update demo appointment");
			},
		});

	const handleBookNew = () => {
		router.push("/dashboard/appointments/doctors");
	};

	const handleCancel = (appointmentId: string) => {
		if (
			window.confirm("Are you sure you want to cancel this demo appointment?")
		) {
			cancelMutation.mutate({ appointmentId });
		}
	};
	const handleNegotiate = (appointmentId: string) => {
		setShowNegotiateModal(appointmentId);
		// TODO: Implement negotiation modal
		toast.info("Negotiation feature coming soon!");
	};

	const handleAccept = (appointmentId: string) => {
		updateStatusMutation.mutate({
			appointmentId,
			status: "CONFIRMED",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-7xl mx-auto">
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
									This is a demonstration of the appointments feature. You
									cannot actually book real medical appointments through this
									interface. This is for portfolio showcase purposes only.
								</p>
							</div>
						</div>
					</div>

					<div className="mb-8">
						<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
							My Appointments
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Manage your healthcare appointments
						</p>
					</div>

					<AppointmentsList
						appointments={appointments || []}
						onBookNew={handleBookNew}
						onCancel={handleCancel}
						onNegotiate={handleNegotiate}
						onAccept={handleAccept}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
}
