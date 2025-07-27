"use client";

import {
	Calendar,
	Clock,
	User,
	MessageCircle,
	X,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AppointmentCardProps {
	appointment: {
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
	onCancel?: (appointmentId: string) => void;
	onNegotiate?: (appointmentId: string) => void;
	onAccept?: (appointmentId: string) => void;
}

const statusColors = {
	PENDING:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
	CONFIRMED:
		"bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
	CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
	COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
	NEGOTIATING:
		"bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
};

export function AppointmentCard({
	appointment,
	onCancel,
	onNegotiate,
	onAccept,
}: AppointmentCardProps) {
	const { doctor, proposedAt, status, notes, negotiations } = appointment;

	const formatDateTime = (date: Date) => {
		return {
			date: format(new Date(date), "MMM dd, yyyy"),
			time: format(new Date(date), "h:mm a"),
		};
	};

	const { date, time } = formatDateTime(proposedAt);

	const hasActiveNegotiation =
		negotiations &&
		negotiations.length > 0 &&
		negotiations[0]?.status === "PENDING";

	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow duration-200">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center space-x-3">
					<div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg">
						{doctor.image ? (
							<img
								src={doctor.image}
								alt={doctor.name}
								className="w-12 h-12 rounded-full object-cover"
							/>
						) : (
							<User className="w-6 h-6" />
						)}
					</div>
					<div>
						<h3 className="font-semibold text-slate-900 dark:text-slate-100">
							{doctor.name}
						</h3>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{doctor.specialty}
						</p>
					</div>
				</div>
				<Badge className={`${statusColors[status]} border-0 font-medium`}>
					{status.charAt(0) + status.slice(1).toLowerCase()}
				</Badge>
			</div>

			{/* Date and Time */}
			<div className="flex items-center space-x-4 mb-4 text-sm">
				<div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
					<Calendar className="w-4 h-4" />
					<span>{date}</span>
				</div>
				<div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
					<Clock className="w-4 h-4" />
					<span>{time}</span>
				</div>
			</div>

			{/* Notes */}
			{notes && (
				<div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
					<p className="text-sm text-slate-700 dark:text-slate-300">
						<span className="font-medium">Notes: </span>
						{notes}
					</p>
				</div>
			)}

			{/* Negotiation Status */}
			{hasActiveNegotiation && (
				<div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
					<div className="flex items-center space-x-2 mb-2">
						<MessageCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
						<span className="text-sm font-medium text-orange-800 dark:text-orange-300">
							Negotiation in Progress
						</span>
					</div>
					{negotiations[0]?.message && (
						<p className="text-sm text-orange-700 dark:text-orange-300">
							{negotiations[0].message}
						</p>
					)}
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-700">
				{status === "PENDING" && (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onCancel?.(appointment.id)}
							className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
						>
							<X className="w-4 h-4 mr-1" />
							Cancel
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onNegotiate?.(appointment.id)}
							className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
						>
							<MessageCircle className="w-4 h-4 mr-1" />
							Negotiate
						</Button>
					</>
				)}

				{status === "NEGOTIATING" && hasActiveNegotiation && (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onCancel?.(appointment.id)}
							className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
						>
							<X className="w-4 h-4 mr-1" />
							Cancel
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onAccept?.(appointment.id)}
							className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20"
						>
							<CheckCircle className="w-4 h-4 mr-1" />
							Accept
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onNegotiate?.(appointment.id)}
							className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
						>
							<MessageCircle className="w-4 h-4 mr-1" />
							Counter
						</Button>
					</>
				)}

				{status === "CANCELLED" && (
					<Badge
						variant="outline"
						className="text-red-600 border-red-200 dark:text-red-400 dark:border-red-800"
					>
						Cancelled
					</Badge>
				)}

				{status === "CONFIRMED" && new Date(proposedAt) > new Date() && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => onCancel?.(appointment.id)}
						className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
					>
						<X className="w-4 h-4 mr-1" />
						Cancel
					</Button>
				)}
			</div>
		</div>
	);
}
