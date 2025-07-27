"use client";

import { useState } from "react";
import { AppointmentCard } from "./AppointmentCard";
import { Calendar, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentsListProps {
	appointments: AppointmentType[];
	onBookNew?: () => void;
	onCancel?: (appointmentId: string) => void;
	onNegotiate?: (appointmentId: string) => void;
	onAccept?: (appointmentId: string) => void;
	isLoading?: boolean;
}

type FilterType =
	| "all"
	| "upcoming"
	| "past"
	| "pending"
	| "confirmed"
	| "cancelled";

type AppointmentType = {
	id: string;
	proposedAt: Date;
	status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NEGOTIATING";
	notes?: string | null;
	doctor: {
		id: string;
		name: string;
		specialty: string;
		image?: string | null;
	};
	negotiations?: Array<{
		id: string;
		proposedBy: "PATIENT" | "DOCTOR";
		proposedAt: Date;
		message?: string | null;
		status: "PENDING" | "ACCEPTED" | "DECLINED";
		createdAt: Date;
	}>;
};

export function AppointmentsList({
	appointments,
	onBookNew,
	onCancel,
	onNegotiate,
	onAccept,
	isLoading = false,
}: AppointmentsListProps) {
	const [filter, setFilter] = useState<FilterType>("all");

	const filterAppointments = (
		appointments: AppointmentType[],
		filter: FilterType,
	): AppointmentType[] => {
		const now = new Date();

		switch (filter) {
			case "upcoming":
				return appointments.filter(
					(apt: AppointmentType) =>
						new Date(apt.proposedAt) > now && apt.status !== "CANCELLED",
				);
			case "past":
				return appointments.filter(
					(apt: AppointmentType) =>
						new Date(apt.proposedAt) <= now || apt.status === "COMPLETED",
				);
			case "pending":
				return appointments.filter(
					(apt: AppointmentType) => apt.status === "PENDING",
				);
			case "confirmed":
				return appointments.filter(
					(apt: AppointmentType) => apt.status === "CONFIRMED",
				);
			case "cancelled":
				return appointments.filter(
					(apt: AppointmentType) => apt.status === "CANCELLED",
				);
			default:
				return appointments;
		}
	};

	const filteredAppointments = filterAppointments(appointments, filter);

	const getFilterCount = (filterType: FilterType) => {
		return filterAppointments(appointments, filterType).length;
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
								<div className="space-y-2">
									<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
									<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
								</div>
							</div>
							<div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20" />
						</div>
						<div className="space-y-2">
							<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48" />
							<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-36" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with filters */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center space-x-2">
					<Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
					<div className="flex flex-wrap gap-2">
						{(
							[
								"all",
								"upcoming",
								"past",
								"pending",
								"confirmed",
								"cancelled",
							] as FilterType[]
						).map((filterType) => (
							<button
								key={filterType}
								onClick={() => setFilter(filterType)}
								className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
									filter === filterType
										? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
										: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
								}`}
							>
								{filterType.charAt(0).toUpperCase() + filterType.slice(1)}
								{getFilterCount(filterType) > 0 && (
									<span className="ml-1 px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded-full text-xs">
										{getFilterCount(filterType)}
									</span>
								)}
							</button>
						))}
					</div>
				</div>

				<Button
					onClick={onBookNew}
					className="bg-emerald-600 hover:bg-emerald-700 text-white"
				>
					<Plus className="w-4 h-4 mr-2" />
					Book New Appointment
				</Button>
			</div>

			{/* Appointments list */}
			{filteredAppointments.length === 0 ? (
				<div className="text-center py-12">
					<Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
						{filter === "all"
							? "No appointments yet"
							: `No ${filter} appointments`}
					</h3>
					<p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
						{filter === "all"
							? "You haven't booked any appointments yet. Click the button below to get started."
							: `You don't have any ${filter} appointments at the moment.`}
					</p>
					{filter === "all" && (
						<Button
							onClick={onBookNew}
							className="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							<Plus className="w-4 h-4 mr-2" />
							Book Your First Appointment
						</Button>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{filteredAppointments.map((appointment) => (
						<AppointmentCard
							key={appointment.id}
							appointment={appointment}
							onCancel={onCancel}
							onNegotiate={onNegotiate}
							onAccept={onAccept}
						/>
					))}
				</div>
			)}
		</div>
	);
}
