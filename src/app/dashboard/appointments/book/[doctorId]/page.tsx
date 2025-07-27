"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Calendar } from "@/components/ui/calendar-rac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Clock, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { format } from "date-fns";

export default function BookAppointmentPage() {
	const router = useRouter();
	const params = useParams();
	const doctorId = params.doctorId as string;

	const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
	const [notes, setNotes] = useState("");
	const [step, setStep] = useState<"date" | "time" | "confirm">("date");

	// Fetch doctor details
	const { data: doctor, isLoading: doctorLoading } =
		api.doctor.getDoctorById.useQuery({
			id: doctorId,
		});

	// Fetch available time slots for selected date
	const selectedDateString = selectedDate
		? `${selectedDate.year}-${selectedDate.month.toString().padStart(2, "0")}-${selectedDate.day.toString().padStart(2, "0")}`
		: "";

	const { data: timeSlots, isLoading: slotsLoading } =
		api.doctor.getAvailableTimeSlots.useQuery(
			{
				doctorId,
				date: selectedDateString,
			},
			{
				enabled: !!selectedDate && step === "time",
			},
		);

	// Create appointment mutation
	const createAppointmentMutation =
		api.appointment.createAppointment.useMutation({
			onSuccess: () => {
				toast.success(
					"Demo appointment created successfully! (This is not a real booking)",
				);
				router.push("/dashboard/appointments");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create demo appointment");
			},
		});

	const handleDateSelect = (date: any) => {
		setSelectedDate(date);
		setSelectedTimeSlot(null);
	};

	const handleTimeSlotSelect = (timeSlot: string) => {
		setSelectedTimeSlot(timeSlot);
	};

	const handleNext = () => {
		if (step === "date" && selectedDate) {
			setStep("time");
		} else if (step === "time" && selectedTimeSlot) {
			setStep("confirm");
		}
	};

	const handleBack = () => {
		if (step === "time") {
			setStep("date");
		} else if (step === "confirm") {
			setStep("time");
		} else {
			router.back();
		}
	};

	const handleConfirmBooking = () => {
		if (!selectedDate || !selectedTimeSlot) {
			toast.error("Please select a date and time");
			return;
		}

		const appointmentDateTime = new Date(
			`${selectedDateString}T${selectedTimeSlot}:00.000Z`,
		);

		createAppointmentMutation.mutate({
			doctorId,
			proposedAt: appointmentDateTime,
			notes: notes.trim() || undefined,
		});
	};

	if (doctorLoading || !doctor) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
				<div className="p-6">
					<div className="max-w-4xl mx-auto">
						<div className="animate-pulse space-y-6">
							<div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64" />
							<div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
							<div className="h-96 bg-slate-200 dark:bg-slate-700 rounded" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center space-x-4 mb-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleBack}
								className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								Back
							</Button>
						</div>
						<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
							Book Appointment
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Schedule your appointment with {doctor.name}
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
									Demo Booking System
								</h3>
								<p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
									This is a demonstration booking interface. No real medical
									appointments will be created. This is a portfolio showcase
									feature only.
								</p>
							</div>
						</div>
					</div>

					{/* Doctor Info */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xl">
								{doctor.image ? (
									<img
										src={doctor.image}
										alt={doctor.name}
										className="w-16 h-16 rounded-full object-cover"
									/>
								) : (
									<User className="w-8 h-8" />
								)}
							</div>
							<div>
								<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
									{doctor.name}
								</h2>
								<p className="text-emerald-600 dark:text-emerald-400 font-medium">
									{doctor.specialty}
								</p>
								{doctor.bio && (
									<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
										{doctor.bio}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Booking Steps */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
						{/* Step Indicator */}
						<div className="flex items-center justify-center space-x-8 mb-8">
							{[
								{ id: "date", label: "Select Date", icon: CalendarIcon },
								{ id: "time", label: "Select Time", icon: Clock },
								{ id: "confirm", label: "Confirm", icon: User },
							].map((stepItem, index) => {
								const isActive = step === stepItem.id;
								const isCompleted =
									(step === "time" && stepItem.id === "date") ||
									(step === "confirm" &&
										(stepItem.id === "date" || stepItem.id === "time"));

								return (
									<div key={stepItem.id} className="flex items-center">
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center ${
												isActive
													? "bg-emerald-600 text-white"
													: isCompleted
														? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
														: "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
											}`}
										>
											<stepItem.icon className="w-5 h-5" />
										</div>
										<span
											className={`ml-2 text-sm font-medium ${
												isActive || isCompleted
													? "text-slate-900 dark:text-slate-100"
													: "text-slate-400 dark:text-slate-500"
											}`}
										>
											{stepItem.label}
										</span>
										{index < 2 && (
											<div
												className={`w-8 h-0.5 mx-4 ${
													isCompleted
														? "bg-emerald-200 dark:bg-emerald-800"
														: "bg-slate-200 dark:bg-slate-700"
												}`}
											/>
										)}
									</div>
								);
							})}
						</div>

						{/* Step Content */}
						{step === "date" && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">
									Select a Date
								</h3>
								<div className="flex justify-center">
									<Calendar
										value={selectedDate}
										onChange={handleDateSelect}
										minValue={today(getLocalTimeZone())}
										className="border border-slate-200 dark:border-slate-700 rounded-lg"
									/>
								</div>
								<div className="flex justify-center">
									<Button
										onClick={handleNext}
										disabled={!selectedDate}
										className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
									>
										Next: Select Time
									</Button>
								</div>
							</div>
						)}

						{step === "time" && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">
									Select a Time Slot
								</h3>
								<p className="text-center text-slate-600 dark:text-slate-400">
									Available slots for{" "}
									{format(new Date(selectedDateString), "MMMM dd, yyyy")}
								</p>

								{slotsLoading ? (
									<div className="grid grid-cols-3 md:grid-cols-4 gap-3">
										{[...Array(8)].map((_, i) => (
											<div
												key={i}
												className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
											/>
										))}
									</div>
								) : timeSlots && timeSlots.length > 0 ? (
									<div className="grid grid-cols-3 md:grid-cols-4 gap-3">
										{timeSlots.map((slot) => (
											<button
												key={slot.time}
												onClick={() => handleTimeSlotSelect(slot.time)}
												className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
													selectedTimeSlot === slot.time
														? "bg-emerald-600 text-white border-emerald-600"
														: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600"
												}`}
											>
												{format(
													new Date(`2000-01-01T${slot.time}:00`),
													"h:mm a",
												)}
											</button>
										))}
									</div>
								) : (
									<div className="text-center py-8">
										<Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
										<p className="text-slate-600 dark:text-slate-400">
											No available time slots for this date
										</p>
									</div>
								)}

								{timeSlots && timeSlots.length > 0 && (
									<div className="flex justify-center">
										<Button
											onClick={handleNext}
											disabled={!selectedTimeSlot}
											className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
										>
											Next: Confirm Booking
										</Button>
									</div>
								)}
							</div>
						)}

						{step === "confirm" && (
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">
									Confirm Your Appointment
								</h3>

								{/* Appointment Summary */}
								<div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 space-y-4">
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Doctor:
										</span>
										<span className="font-medium text-slate-900 dark:text-slate-100">
											{doctor.name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Specialty:
										</span>
										<span className="font-medium text-slate-900 dark:text-slate-100">
											{doctor.specialty}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Date:
										</span>
										<span className="font-medium text-slate-900 dark:text-slate-100">
											{format(new Date(selectedDateString), "MMMM dd, yyyy")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-600 dark:text-slate-400">
											Time:
										</span>
										<span className="font-medium text-slate-900 dark:text-slate-100">
											{selectedTimeSlot &&
												format(
													new Date(`2000-01-01T${selectedTimeSlot}:00`),
													"h:mm a",
												)}
										</span>
									</div>
								</div>

								{/* Notes */}
								<div className="space-y-2">
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
										Notes (Optional)
									</label>
									<Input
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Any specific concerns or notes for the doctor..."
										className="w-full"
									/>
								</div>

								{/* Confirm Button */}
								<div className="flex justify-center">
									<Button
										onClick={handleConfirmBooking}
										disabled={createAppointmentMutation.isPending}
										className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
									>
										{createAppointmentMutation.isPending
											? "Creating Demo..."
											: "Create Demo Appointment"}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
