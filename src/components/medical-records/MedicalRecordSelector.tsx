import React from "react";
import {
	Activity,
	Heart,
	Droplet,
	Thermometer,
	Scale,
	Ruler,
	Calculator,
	Pill,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicalRecordSelectorProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (recordType: string) => void;
}

const recordTypes = [
	{
		key: "blood_pressure",
		title: "Blood Pressure",
		description: "Systolic/Diastolic readings",
		icon: <Activity className="w-6 h-6" />,
		color:
			"bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30",
	},
	{
		key: "heart_rate",
		title: "Heart Rate",
		description: "Beats per minute",
		icon: <Heart className="w-6 h-6" />,
		color:
			"bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30",
	},
	{
		key: "blood_sugar",
		title: "Blood Sugar",
		description: "Glucose levels",
		icon: <Droplet className="w-6 h-6" />,
		color:
			"bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30",
	},
	{
		key: "cholesterol",
		title: "Cholesterol",
		description: "Total, LDL, HDL, Triglycerides",
		icon: <Activity className="w-6 h-6" />,
		color:
			"bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30",
	},
	{
		key: "body_temperature",
		title: "Body Temperature",
		description: "Temperature in °F or °C",
		icon: <Thermometer className="w-6 h-6" />,
		color:
			"bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30",
	},
	{
		key: "oxygen_saturation",
		title: "Oxygen Saturation",
		description: "SpO2 percentage",
		icon: <Activity className="w-6 h-6" />,
		color:
			"bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/30",
	},
	{
		key: "weight",
		title: "Weight",
		description: "Body weight in kg",
		icon: <Scale className="w-6 h-6" />,
		color:
			"bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30",
	},
	{
		key: "height",
		title: "Height",
		description: "Height in cm",
		icon: <Ruler className="w-6 h-6" />,
		color:
			"bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30",
	},
	{
		key: "bmi",
		title: "BMI",
		description: "Body Mass Index",
		icon: <Calculator className="w-6 h-6" />,
		color:
			"bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30",
	},
	{
		key: "current_medications",
		title: "Current Medications",
		description: "Medication, dose, frequency",
		icon: <Pill className="w-6 h-6" />,
		color:
			"bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30",
	},
	{
		key: "past_illnesses",
		title: "Past Illnesses",
		description: "Medical history",
		icon: <FileText className="w-6 h-6" />,
		color:
			"bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/20 dark:hover:bg-slate-900/30",
	},
];

export function MedicalRecordSelector({
	isOpen,
	onClose,
	onSelect,
}: MedicalRecordSelectorProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
					Add Medical Record
				</h2>
				<p className="text-slate-600 dark:text-slate-400 mb-6">
					Select the type of medical record you want to add:
				</p>

				<div className="grid gap-3 md:grid-cols-2">
					{recordTypes.map((type) => (
						<button
							key={type.key}
							onClick={() => {
								onSelect(type.key);
								onClose();
							}}
							className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-left transition-colors ${type.color}`}
						>
							<div className="flex items-center gap-3 mb-2">
								<div className="text-slate-600 dark:text-slate-400">
									{type.icon}
								</div>
								<h3 className="font-semibold text-slate-900 dark:text-slate-100">
									{type.title}
								</h3>
							</div>
							<p className="text-sm text-slate-600 dark:text-slate-400">
								{type.description}
							</p>
						</button>
					))}
				</div>

				<div className="flex justify-end pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
