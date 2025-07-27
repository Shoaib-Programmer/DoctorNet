"use client";

import { useState } from "react";
import { DoctorCard } from "./DoctorCard";
import { Search, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DoctorsListProps {
	doctors: Array<{
		id: string;
		name: string;
		specialty: string;
		bio?: string | null;
		image?: string | null;
		isAvailable: boolean;
		_count?: {
			appointments: number;
		};
	}>;
	onBookAppointment: (doctorId: string) => void;
	isLoading?: boolean;
}

export function DoctorsList({
	doctors,
	onBookAppointment,
	isLoading = false,
}: DoctorsListProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

	// Get unique specialties
	const specialties = [
		"all",
		...Array.from(new Set(doctors.map((doc) => doc.specialty))),
	];

	// Filter doctors based on search and specialty
	const filteredDoctors = doctors.filter((doctor) => {
		const matchesSearch =
			doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSpecialty =
			selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
		return matchesSearch && matchesSpecialty;
	});

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse"
						>
							<div className="flex items-start space-x-4 mb-4">
								<div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
								<div className="flex-1 space-y-2">
									<div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
									<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
									<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28" />
								</div>
							</div>
							<div className="space-y-2 mb-4">
								<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
								<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
							</div>
							<div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Search and Filter Controls */}
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Search */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
					<Input
						type="text"
						placeholder="Search doctors by name or specialty..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Specialty Filter */}
				<div className="flex items-center space-x-2">
					<Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
					<select
						value={selectedSpecialty}
						onChange={(e) => setSelectedSpecialty(e.target.value)}
						className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
					>
						{specialties.map((specialty) => (
							<option key={specialty} value={specialty}>
								{specialty === "all" ? "All Specialties" : specialty}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Results Summary */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
					<Users className="w-5 h-5" />
					<span className="text-sm">
						{filteredDoctors.length} doctor
						{filteredDoctors.length !== 1 ? "s" : ""} found
					</span>
				</div>
			</div>

			{/* Doctors Grid */}
			{filteredDoctors.length === 0 ? (
				<div className="text-center py-12">
					<Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
						No doctors found
					</h3>
					<p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
						{searchTerm || selectedSpecialty !== "all"
							? "Try adjusting your search criteria or filters."
							: "No doctors are currently available."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredDoctors.map((doctor) => (
						<DoctorCard
							key={doctor.id}
							doctor={doctor}
							onBookAppointment={onBookAppointment}
						/>
					))}
				</div>
			)}
		</div>
	);
}
