"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Heart,
	User,
	Calendar,
	Scale,
	Ruler,
	Droplet,
	Phone,
	MapPin,
	AlertTriangle,
	Pill,
	FileText,
	Users,
	ChevronRight,
	ChevronLeft,
	Check,
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingModalProps {
	isOpen: boolean;
	onComplete: () => void;
}

interface FormData {
	fullName: string;
	dateOfBirth: string;
	gender: "male" | "female" | "other" | "prefer-not-to-say";
	height: string;
	weight: string;
	bloodType:
		| "A+"
		| "A-"
		| "B+"
		| "B-"
		| "AB+"
		| "AB-"
		| "O+"
		| "O-"
		| "unknown";
	allergies: string[];
	medications: string[];
	medicalHistory: string[];
	emergencyContact: {
		name: string;
		phone: string;
		relationship: string;
	};
	phoneNumber: string;
	address: string;
}

const steps = [
	{
		id: "personal",
		title: "Personal Information",
		description: "Let's start with your basic information",
		icon: User,
	},
	{
		id: "physical",
		title: "Physical Information",
		description: "Height, weight, and other physical details",
		icon: Scale,
	},
	{
		id: "medical",
		title: "Medical Information",
		description: "Medical history and current medications",
		icon: Heart,
	},
	{
		id: "contact",
		title: "Contact & Emergency",
		description: "Contact details and emergency information",
		icon: Phone,
	},
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		dateOfBirth: "",
		gender: "prefer-not-to-say",
		height: "",
		weight: "",
		bloodType: "unknown",
		allergies: [],
		medications: [],
		medicalHistory: [],
		emergencyContact: {
			name: "",
			phone: "",
			relationship: "",
		},
		phoneNumber: "",
		address: "",
	});

	const updateMedicalInfoMutation = api.user.updateMedicalInfo.useMutation({
		onSuccess: () => {
			toast.success(
				"Welcome to DoctorNet! Your profile has been set up successfully.",
			);
			onComplete();
		},
		onError: (error) => {
			toast.error("Failed to save your information. Please try again.");
			console.error("Error saving medical info:", error);
		},
	});

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNestedInputChange = (
		parent: string,
		field: string,
		value: any,
	) => {
		setFormData((prev) => ({
			...prev,
			[parent]: {
				...(prev[parent as keyof FormData] as Record<string, any>),
				[field]: value,
			},
		}));
	};

	const handleArrayInputChange = (field: string, value: string) => {
		if (value.trim()) {
			setFormData((prev) => ({
				...prev,
				[field]: [...(prev[field as keyof FormData] as string[]), value.trim()],
			}));
		}
	};

	const removeArrayItem = (field: string, index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: (prev[field as keyof FormData] as string[]).filter(
				(_, i) => i !== index,
			),
		}));
	};

	const validateStep = () => {
		switch (currentStep) {
			case 0: // Personal
				return formData.fullName && formData.dateOfBirth && formData.gender;
			case 1: // Physical
				return formData.height && formData.weight && formData.bloodType;
			case 2: // Medical
				return true; // Optional fields
			case 3: // Contact
				return (
					formData.phoneNumber &&
					formData.address &&
					formData.emergencyContact.name &&
					formData.emergencyContact.phone &&
					formData.emergencyContact.relationship
				);
			default:
				return false;
		}
	};

	const handleNext = () => {
		if (validateStep()) {
			if (currentStep < steps.length - 1) {
				setCurrentStep(currentStep + 1);
			} else {
				handleSubmit();
			}
		} else {
			toast.error("Please fill in all required fields");
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		updateMedicalInfoMutation.mutate({
			fullName: formData.fullName,
			dateOfBirth: new Date(formData.dateOfBirth),
			gender: formData.gender,
			height: parseFloat(formData.height),
			weight: parseFloat(formData.weight),
			bloodType: formData.bloodType,
			allergies: formData.allergies,
			medications: formData.medications,
			medicalHistory: formData.medicalHistory,
			emergencyContact: formData.emergencyContact,
			phoneNumber: formData.phoneNumber,
			address: formData.address,
		});
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
							<Heart className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-2xl font-bold">Welcome to DoctorNet</h2>
							<p className="text-emerald-100">
								Let's set up your medical profile
							</p>
						</div>
					</div>
				</div>

				{/* Progress Steps */}
				<div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isActive = index === currentStep;
							const isCompleted = index < currentStep;

							return (
								<div key={step.id} className="flex items-center">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
											isCompleted
												? "bg-emerald-500 text-white"
												: isActive
													? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500"
													: "bg-slate-100 dark:bg-slate-800 text-slate-400"
										}`}
									>
										{isCompleted ? (
											<Check className="w-5 h-5" />
										) : (
											<Icon className="w-5 h-5" />
										)}
									</div>
									{index < steps.length - 1 && (
										<div
											className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
												isCompleted
													? "bg-emerald-500"
													: "bg-slate-200 dark:bg-slate-700"
											}`}
										/>
									)}
								</div>
							);
						})}
					</div>
					<div className="mt-3">
						<h3 className="font-semibold text-slate-900 dark:text-slate-100">
							{steps[currentStep]?.title}
						</h3>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{steps[currentStep]?.description}
						</p>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-6">
						{currentStep === 0 && (
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Full Name *
									</label>
									<Input
										value={formData.fullName}
										onChange={(e) =>
											handleInputChange("fullName", e.target.value)
										}
										placeholder="Enter your full name"
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Date of Birth *
									</label>
									<Input
										type="date"
										value={formData.dateOfBirth}
										onChange={(e) =>
											handleInputChange("dateOfBirth", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Gender *
									</label>
									<select
										value={formData.gender}
										onChange={(e) =>
											handleInputChange("gender", e.target.value)
										}
										className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
									>
										<option value="prefer-not-to-say">Prefer not to say</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="other">Other</option>
									</select>
								</div>
							</div>
						)}

						{currentStep === 1 && (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
											Height (cm) *
										</label>
										<div className="relative">
											<Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
											<Input
												type="number"
												value={formData.height}
												onChange={(e) =>
													handleInputChange("height", e.target.value)
												}
												placeholder="170"
												className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
											Weight (kg) *
										</label>
										<div className="relative">
											<Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
											<Input
												type="number"
												value={formData.weight}
												onChange={(e) =>
													handleInputChange("weight", e.target.value)
												}
												placeholder="70"
												className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
											/>
										</div>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Blood Type *
									</label>
									<div className="relative">
										<Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
										<select
											value={formData.bloodType}
											onChange={(e) =>
												handleInputChange("bloodType", e.target.value)
											}
											className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
										>
											<option value="unknown">Unknown</option>
											<option value="A+">A+</option>
											<option value="A-">A-</option>
											<option value="B+">B+</option>
											<option value="B-">B-</option>
											<option value="AB+">AB+</option>
											<option value="AB-">AB-</option>
											<option value="O+">O+</option>
											<option value="O-">O-</option>
										</select>
									</div>
								</div>
							</div>
						)}

						{currentStep === 2 && (
							<div className="space-y-6">
								{/* Allergies */}
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										<div className="flex items-center space-x-2">
											<AlertTriangle className="w-4 h-4" />
											<span>Allergies (Optional)</span>
										</div>
									</label>
									<div className="space-y-2">
										<Input
											placeholder="Add allergy (press Enter)"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													handleArrayInputChange(
														"allergies",
														e.currentTarget.value,
													);
													e.currentTarget.value = "";
												}
											}}
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
										<div className="flex flex-wrap gap-2">
											{formData.allergies.map((allergy, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
												>
													{allergy}
													<button
														onClick={() => removeArrayItem("allergies", index)}
														className="text-red-500 hover:text-red-700"
													>
														×
													</button>
												</span>
											))}
										</div>
									</div>
								</div>

								{/* Medications */}
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										<div className="flex items-center space-x-2">
											<Pill className="w-4 h-4" />
											<span>Current Medications (Optional)</span>
										</div>
									</label>
									<div className="space-y-2">
										<Input
											placeholder="Add medication (press Enter)"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													handleArrayInputChange(
														"medications",
														e.currentTarget.value,
													);
													e.currentTarget.value = "";
												}
											}}
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
										<div className="flex flex-wrap gap-2">
											{formData.medications.map((medication, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
												>
													{medication}
													<button
														onClick={() =>
															removeArrayItem("medications", index)
														}
														className="text-blue-500 hover:text-blue-700"
													>
														×
													</button>
												</span>
											))}
										</div>
									</div>
								</div>

								{/* Medical History */}
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										<div className="flex items-center space-x-2">
											<FileText className="w-4 h-4" />
											<span>Medical History (Optional)</span>
										</div>
									</label>
									<div className="space-y-2">
										<Input
											placeholder="Add medical condition (press Enter)"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													handleArrayInputChange(
														"medicalHistory",
														e.currentTarget.value,
													);
													e.currentTarget.value = "";
												}
											}}
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
										<div className="flex flex-wrap gap-2">
											{formData.medicalHistory.map((condition, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
												>
													{condition}
													<button
														onClick={() =>
															removeArrayItem("medicalHistory", index)
														}
														className="text-emerald-500 hover:text-emerald-700"
													>
														×
													</button>
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{currentStep === 3 && (
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Phone Number *
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
										<Input
											value={formData.phoneNumber}
											onChange={(e) =>
												handleInputChange("phoneNumber", e.target.value)
											}
											placeholder="+1 (555) 123-4567"
											className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
										Address *
									</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
										<textarea
											value={formData.address}
											onChange={(e) =>
												handleInputChange("address", e.target.value)
											}
											placeholder="123 Main St, City, State, ZIP"
											rows={3}
											className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
										/>
									</div>
								</div>
								<div className="border-t border-slate-200 dark:border-slate-700 pt-4">
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
										<div className="flex items-center space-x-2">
											<Users className="w-4 h-4" />
											<span>Emergency Contact *</span>
										</div>
									</label>
									<div className="space-y-3">
										<Input
											value={formData.emergencyContact.name}
											onChange={(e) =>
												handleNestedInputChange(
													"emergencyContact",
													"name",
													e.target.value,
												)
											}
											placeholder="Emergency contact name"
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
										<Input
											value={formData.emergencyContact.phone}
											onChange={(e) =>
												handleNestedInputChange(
													"emergencyContact",
													"phone",
													e.target.value,
												)
											}
											placeholder="Emergency contact phone"
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
										<Input
											value={formData.emergencyContact.relationship}
											onChange={(e) =>
												handleNestedInputChange(
													"emergencyContact",
													"relationship",
													e.target.value,
												)
											}
											placeholder="Relationship (e.g., Spouse, Parent, Sibling)"
											className="focus:ring-emerald-500 focus:border-emerald-500"
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
					<div className="flex justify-between">
						<Button
							variant="ghost"
							onClick={handlePrevious}
							disabled={currentStep === 0}
							className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Previous
						</Button>
						<Button
							onClick={handleNext}
							disabled={!validateStep() || updateMedicalInfoMutation.isPending}
							className="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							{updateMedicalInfoMutation.isPending ? (
								"Saving..."
							) : currentStep === steps.length - 1 ? (
								"Complete Setup"
							) : (
								<>
									Next
									<ChevronRight className="w-4 h-4 ml-1" />
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
