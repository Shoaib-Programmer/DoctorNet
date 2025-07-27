"use client";

import { User, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
	doctor: {
		id: string;
		name: string;
		specialty: string;
		bio?: string | null;
		image?: string | null;
		isAvailable: boolean;
		_count?: {
			appointments: number;
		};
	};
	onBookAppointment: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
	const { name, specialty, bio, image, isAvailable, _count } = doctor;

	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-600">
			{/* Header */}
			<div className="flex items-start space-x-4 mb-4">
				<div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
					{image ? (
						<img
							src={image}
							alt={name}
							className="w-16 h-16 rounded-full object-cover"
						/>
					) : (
						<User className="w-8 h-8" />
					)}
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate">
						{name}
					</h3>
					<p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">
						{specialty}
					</p>
					<div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
						<div className="flex items-center space-x-1">
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							<span>4.8</span>
						</div>
						{_count && (
							<div className="flex items-center space-x-1">
								<Calendar className="w-4 h-4" />
								<span>{_count.appointments} appointments</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Bio */}
			{bio && (
				<p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
					{bio}
				</p>
			)}

			{/* Availability Status */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-2">
					<Clock className="w-4 h-4 text-slate-500" />
					<Badge
						variant="outline"
						className={`${
							isAvailable
								? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-900/20"
								: "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-900/20"
						}`}
					>
						{isAvailable ? "Available" : "Unavailable"}
					</Badge>
				</div>
				{isAvailable && (
					<span className="text-xs text-slate-500 dark:text-slate-400">
						Mon-Fri, 9:00 AM - 5:00 PM
					</span>
				)}
			</div>

			{/* Action Button */}
			<Button
				onClick={() => onBookAppointment(doctor.id)}
				disabled={!isAvailable}
				className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white"
			>
				{isAvailable ? "Book Appointment" : "Currently Unavailable"}
			</Button>
		</div>
	);
}
