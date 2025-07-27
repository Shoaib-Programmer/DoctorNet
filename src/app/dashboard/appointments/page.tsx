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
			toast.success("Appointment cancelled successfully");
			void refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to cancel appointment");
		},
	});

	const updateStatusMutation =
		api.appointment.updateAppointmentStatus.useMutation({
			onSuccess: () => {
				toast.success("Appointment confirmed successfully");
				void refetch();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update appointment");
			},
		});

	const handleBookNew = () => {
		router.push("/dashboard/appointments/doctors");
	};

	const handleCancel = (appointmentId: string) => {
		if (window.confirm("Are you sure you want to cancel this appointment?")) {
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
