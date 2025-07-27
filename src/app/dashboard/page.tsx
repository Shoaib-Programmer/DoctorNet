"use client";

import { api } from "@/trpc/react";
import { Calendar, FileText, User, Heart, Scale, Droplet } from "lucide-react";

export default function Dashboard() {
	const { data: currentUser } = api.user.getCurrentUser.useQuery();
	const { data: appointments } = api.appointment.getMyAppointments.useQuery();

	const calculateAge = (dateOfBirth: Date) => {
		const today = new Date();
		const birth = new Date(dateOfBirth);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}
		return age;
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(new Date(date));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-7xl mx-auto">
					{/* Welcome Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
							Welcome back,{" "}
							{currentUser?.fullName || currentUser?.name || "User"}! 👋
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Here's an overview of your healthcare dashboard
						</p>
					</div>

					{/* Profile Summary Cards */}
					{currentUser?.onboardingCompleted && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
										<User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
									</div>
									<div>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											Age
										</p>
										<p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
											{currentUser.dateOfBirth
												? calculateAge(currentUser.dateOfBirth)
												: "N/A"}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
										<Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											Weight
										</p>
										<p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
											{currentUser.weight ? `${currentUser.weight} kg` : "N/A"}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
										<Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									</div>
									<div>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											Height
										</p>
										<p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
											{currentUser.height ? `${currentUser.height} cm` : "N/A"}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
										<Droplet className="w-5 h-5 text-red-600 dark:text-red-400" />
									</div>
									<div>
										<p className="text-sm text-slate-600 dark:text-slate-400">
											Blood Type
										</p>
										<p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
											{currentUser.bloodType || "Unknown"}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Dashboard content */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
									<Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
								</div>
								<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
									Recent Appointments
								</h3>
							</div>
							{appointments && appointments.length > 0 ? (
								<div className="space-y-2">
									{appointments.slice(0, 3).map((appointment) => (
										<div
											key={appointment.id}
											className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
										>
											<p className="font-medium text-slate-900 dark:text-slate-100">
												{appointment.doctor.name}
											</p>
											<p className="text-sm text-slate-600 dark:text-slate-400">
												{formatDate(appointment.proposedAt)}
											</p>
											<p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize">
												{appointment.status.toLowerCase()}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-slate-600 dark:text-slate-400">
									No upcoming appointments
								</p>
							)}
						</div>

						<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
									<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
								</div>
								<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
									Medical Records
								</h3>
							</div>
							<div className="space-y-2">
								<p className="text-slate-600 dark:text-slate-400">
									3 documents available
								</p>
								<div className="text-sm space-y-1">
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Blood Test
										</span>
										<span className="text-emerald-600 dark:text-emerald-400">
											Recent
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											X-Ray Report
										</span>
										<span className="text-slate-500 dark:text-slate-500">
											2 weeks ago
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Prescription
										</span>
										<span className="text-slate-500 dark:text-slate-500">
											1 month ago
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
									<Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
								</div>
								<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
									Health Overview
								</h3>
							</div>
							{currentUser?.onboardingCompleted ? (
								<div className="space-y-2 text-sm">
									{currentUser.allergies &&
										JSON.parse(currentUser.allergies).length > 0 && (
											<div>
												<span className="text-slate-600 dark:text-slate-400">
													Allergies:
												</span>
												<span className="ml-2 text-slate-900 dark:text-slate-100">
													{JSON.parse(currentUser.allergies).join(", ")}
												</span>
											</div>
										)}
									{currentUser.medications &&
										JSON.parse(currentUser.medications).length > 0 && (
											<div>
												<span className="text-slate-600 dark:text-slate-400">
													Medications:
												</span>
												<span className="ml-2 text-slate-900 dark:text-slate-100">
													{JSON.parse(currentUser.medications).length} active
												</span>
											</div>
										)}
									<div>
										<span className="text-slate-600 dark:text-slate-400">
											Profile:
										</span>
										<span className="ml-2 text-emerald-600 dark:text-emerald-400">
											Complete
										</span>
									</div>
								</div>
							) : (
								<p className="text-slate-600 dark:text-slate-400">
									Complete your profile to see health overview
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
