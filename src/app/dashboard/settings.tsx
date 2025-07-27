"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
	Save,
	Edit,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<any>({});

	const { data: currentUser, refetch } = api.user.getCurrentUser.useQuery();

	const updateMedicalInfoMutation = api.user.updateMedicalInfo.useMutation({
		onSuccess: () => {
			toast.success("Your medical information has been updated successfully.");
			setIsEditing(false);
			refetch();
		},
		onError: (error) => {
			toast.error("Failed to update your information. Please try again.");
			console.error("Error updating medical info:", error);
		},
	});

	const handleEdit = () => {
		if (currentUser) {
			setFormData({
				fullName: currentUser.fullName || "",
				dateOfBirth: currentUser.dateOfBirth
					? new Date(currentUser.dateOfBirth).toISOString().split("T")[0]
					: "",
				gender: currentUser.gender || "prefer-not-to-say",
				height: currentUser.height?.toString() || "",
				weight: currentUser.weight?.toString() || "",
				bloodType: currentUser.bloodType || "unknown",
				allergies: currentUser.allergies
					? JSON.parse(currentUser.allergies)
					: [],
				medications: currentUser.medications
					? JSON.parse(currentUser.medications)
					: [],
				medicalHistory: currentUser.medicalHistory
					? JSON.parse(currentUser.medicalHistory)
					: [],
				emergencyContact: currentUser.emergencyContact
					? JSON.parse(currentUser.emergencyContact)
					: { name: "", phone: "", relationship: "" },
				phoneNumber: currentUser.phoneNumber || "",
				address: currentUser.address || "",
			});
		}
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFormData({});
	};

	const handleSave = () => {
		if (!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber) {
			toast.error("Please fill in all required fields");
			return;
		}

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

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNestedInputChange = (
		parent: string,
		field: string,
		value: any,
	) => {
		setFormData((prev: any) => ({
			...prev,
			[parent]: {
				...prev[parent],
				[field]: value,
			},
		}));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

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

	if (!currentUser) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-400">
						Loading your profile...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
								Medical Profile Settings
							</h1>
							<p className="text-slate-600 dark:text-slate-400">
								View and manage your medical information
							</p>
						</div>
						{!isEditing ? (
							<Button
								onClick={handleEdit}
								className="bg-emerald-600 hover:bg-emerald-700 text-white"
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit Profile
							</Button>
						) : (
							<div className="space-x-2">
								<Button variant="outline" onClick={handleCancel}>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={updateMedicalInfoMutation.isPending}
									className="bg-emerald-600 hover:bg-emerald-700 text-white"
								>
									<Save className="w-4 h-4 mr-2" />
									{updateMedicalInfoMutation.isPending
										? "Saving..."
										: "Save Changes"}
								</Button>
							</div>
						)}
					</div>

					{/* Personal Information */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
						<div className="flex items-center space-x-2 mb-4">
							<User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
								Personal Information
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Full Name
								</label>
								{isEditing ? (
									<Input
										value={formData.fullName || ""}
										onChange={(e) =>
											handleInputChange("fullName", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.fullName || "Not provided"}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Date of Birth
								</label>
								{isEditing ? (
									<Input
										type="date"
										value={formData.dateOfBirth || ""}
										onChange={(e) =>
											handleInputChange("dateOfBirth", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.dateOfBirth
											? `${formatDate(currentUser.dateOfBirth.toString())} (Age: ${calculateAge(
													currentUser.dateOfBirth,
												)})`
											: "Not provided"}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Gender
								</label>
								{isEditing ? (
									<select
										value={formData.gender || "prefer-not-to-say"}
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
								) : (
									<p className="text-slate-900 dark:text-slate-100 capitalize">
										{currentUser.gender?.replace("-", " ") || "Not provided"}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Physical Information */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
						<div className="flex items-center space-x-2 mb-4">
							<Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
								Physical Information
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Height (cm)
								</label>
								{isEditing ? (
									<Input
										type="number"
										value={formData.height || ""}
										onChange={(e) =>
											handleInputChange("height", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.height
											? `${currentUser.height} cm`
											: "Not provided"}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Weight (kg)
								</label>
								{isEditing ? (
									<Input
										type="number"
										value={formData.weight || ""}
										onChange={(e) =>
											handleInputChange("weight", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.weight
											? `${currentUser.weight} kg`
											: "Not provided"}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Blood Type
								</label>
								{isEditing ? (
									<select
										value={formData.bloodType || "unknown"}
										onChange={(e) =>
											handleInputChange("bloodType", e.target.value)
										}
										className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.bloodType || "Unknown"}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Medical Information */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
						<div className="flex items-center space-x-2 mb-4">
							<FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
								Medical Information
							</h3>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Allergies
								</label>
								{currentUser.allergies &&
								JSON.parse(currentUser.allergies).length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{JSON.parse(currentUser.allergies).map(
											(allergy: string, index: number) => (
												<span
													key={index}
													className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
												>
													{allergy}
												</span>
											),
										)}
									</div>
								) : (
									<p className="text-slate-600 dark:text-slate-400">
										No known allergies
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Current Medications
								</label>
								{currentUser.medications &&
								JSON.parse(currentUser.medications).length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{JSON.parse(currentUser.medications).map(
											(medication: string, index: number) => (
												<span
													key={index}
													className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
												>
													{medication}
												</span>
											),
										)}
									</div>
								) : (
									<p className="text-slate-600 dark:text-slate-400">
										No current medications
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Medical History
								</label>
								{currentUser.medicalHistory &&
								JSON.parse(currentUser.medicalHistory).length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{JSON.parse(currentUser.medicalHistory).map(
											(condition: string, index: number) => (
												<span
													key={index}
													className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
												>
													{condition}
												</span>
											),
										)}
									</div>
								) : (
									<p className="text-slate-600 dark:text-slate-400">
										No medical history recorded
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
						<div className="flex items-center space-x-2 mb-4">
							<Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
								Contact Information
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Phone Number
								</label>
								{isEditing ? (
									<Input
										value={formData.phoneNumber || ""}
										onChange={(e) =>
											handleInputChange("phoneNumber", e.target.value)
										}
										className="focus:ring-emerald-500 focus:border-emerald-500"
									/>
								) : (
									<p className="text-slate-900 dark:text-slate-100">
										{currentUser.phoneNumber || "Not provided"}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Email
								</label>
								<p className="text-slate-900 dark:text-slate-100">
									{currentUser.email}
								</p>
							</div>
						</div>
						<div className="mb-6">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Address
							</label>
							{isEditing ? (
								<textarea
									value={formData.address || ""}
									onChange={(e) => handleInputChange("address", e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
								/>
							) : (
								<p className="text-slate-900 dark:text-slate-100">
									{currentUser.address || "Not provided"}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
								Emergency Contact
							</label>
							{currentUser.emergencyContact ? (
								(() => {
									const contact = JSON.parse(currentUser.emergencyContact);
									return (
										<div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div>
													<span className="text-sm text-slate-600 dark:text-slate-400">
														Name:
													</span>
													<p className="font-medium text-slate-900 dark:text-slate-100">
														{contact.name}
													</p>
												</div>
												<div>
													<span className="text-sm text-slate-600 dark:text-slate-400">
														Phone:
													</span>
													<p className="font-medium text-slate-900 dark:text-slate-100">
														{contact.phone}
													</p>
												</div>
												<div>
													<span className="text-sm text-slate-600 dark:text-slate-400">
														Relationship:
													</span>
													<p className="font-medium text-slate-900 dark:text-slate-100">
														{contact.relationship}
													</p>
												</div>
											</div>
										</div>
									);
								})()
							) : (
								<p className="text-slate-600 dark:text-slate-400">
									No emergency contact provided
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
