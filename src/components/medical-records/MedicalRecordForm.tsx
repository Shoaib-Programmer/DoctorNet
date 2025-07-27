import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";

// Predefined list of diseases for autocomplete
const PREDEFINED_DISEASES = [
	"Asthma",
	"Diabetes (Type 1 or Type 2)",
	"Hypertension (High Blood Pressure)",
	"High Cholesterol",
	"Heart Disease",
	"Arthritis (e.g. Osteoarthritis, Rheumatoid Arthritis)",
	"Thyroid Disorders (Hypothyroidism, Hyperthyroidism)",
	"Chronic Kidney Disease",
	"Epilepsy",
	"Migraine",
	"Depression",
	"Anxiety Disorders",
	"Bipolar Disorder",
	"Schizophrenia",
	"Chronic Obstructive Pulmonary Disease (COPD)",
	"Cancer (Specify Type if Needed)",
	"HIV/AIDS",
	"Celiac Disease",
	"Crohn's Disease",
	"Ulcerative Colitis",
	"Psoriasis",
	"Lupus",
	"Multiple Sclerosis",
	"Parkinson's Disease",
	"Alzheimer's or Other Dementia",
	"Obesity",
	"Sleep Apnea",
	"Polycystic Ovary Syndrome (PCOS)",
	"Tuberculosis (If Previously Diagnosed/Treated)",
];

interface MedicalRecordFormProps {
	isOpen: boolean;
	onClose: () => void;
	recordType: string | null;
	initialData?: any;
	onSuccess?: () => void;
}

const recordTypeConfigs = {
	blood_pressure: {
		title: "Blood Pressure",
		fields: [
			{
				key: "systolic",
				label: "Systolic",
				type: "number",
				placeholder: "120",
				unit: "mmHg",
			},
			{
				key: "diastolic",
				label: "Diastolic",
				type: "number",
				placeholder: "80",
				unit: "mmHg",
			},
		],
		unit: "mmHg",
		format: (data: any) => `${data.systolic}/${data.diastolic}`,
	},
	heart_rate: {
		title: "Heart Rate",
		fields: [
			{
				key: "rate",
				label: "Heart Rate",
				type: "number",
				placeholder: "72",
				unit: "bpm",
			},
		],
		unit: "bpm",
		format: (data: any) => data.rate,
	},
	blood_sugar: {
		title: "Blood Sugar",
		fields: [
			{
				key: "level",
				label: "Blood Sugar Level",
				type: "number",
				placeholder: "100",
				unit: "mg/dL",
			},
		],
		unit: "mg/dL",
		format: (data: any) => data.level,
	},
	cholesterol: {
		title: "Cholesterol",
		fields: [
			{
				key: "total",
				label: "Total Cholesterol",
				type: "number",
				placeholder: "200",
				unit: "mg/dL",
			},
			{
				key: "ldl",
				label: "LDL",
				type: "number",
				placeholder: "100",
				unit: "mg/dL",
			},
			{
				key: "hdl",
				label: "HDL",
				type: "number",
				placeholder: "50",
				unit: "mg/dL",
			},
			{
				key: "triglycerides",
				label: "Triglycerides",
				type: "number",
				placeholder: "150",
				unit: "mg/dL",
			},
		],
		unit: "mg/dL",
		format: (data: any) =>
			`Total: ${data.total}, LDL: ${data.ldl}, HDL: ${data.hdl}, Triglycerides: ${data.triglycerides}`,
	},
	body_temperature: {
		title: "Body Temperature",
		fields: [
			{
				key: "temperature",
				label: "Temperature",
				type: "number",
				placeholder: "98.6",
				step: "0.1",
			},
			{
				key: "unit",
				label: "Unit",
				type: "select",
				options: ["°F", "°C"],
				defaultValue: "°F",
			},
		],
		unit: "°F/°C",
		format: (data: any) => `${data.temperature}${data.unit}`,
	},
	oxygen_saturation: {
		title: "Oxygen Saturation",
		fields: [
			{
				key: "saturation",
				label: "Oxygen Saturation",
				type: "number",
				placeholder: "98",
				min: "0",
				max: "100",
				unit: "%",
			},
		],
		unit: "%",
		format: (data: any) => data.saturation,
	},
	weight: {
		title: "Weight",
		fields: [
			{
				key: "weight",
				label: "Weight",
				type: "number",
				placeholder: "70",
				step: "0.1",
				unit: "kg",
			},
		],
		unit: "kg",
		format: (data: any) => data.weight,
	},
	height: {
		title: "Height",
		fields: [
			{
				key: "height",
				label: "Height",
				type: "number",
				placeholder: "170",
				unit: "cm",
			},
		],
		unit: "cm",
		format: (data: any) => data.height,
	},
	bmi: {
		title: "BMI",
		fields: [
			{
				key: "bmi",
				label: "BMI",
				type: "number",
				placeholder: "24.2",
				step: "0.1",
			},
		],
		unit: "",
		format: (data: any) => data.bmi,
	},
	current_medications: {
		title: "Current Medications",
		fields: [
			{
				key: "medication",
				label: "Medication Name",
				type: "text",
				placeholder: "Medication name",
			},
			{ key: "dose", label: "Dose", type: "text", placeholder: "10mg" },
			{
				key: "frequency",
				label: "Frequency",
				type: "text",
				placeholder: "Twice daily",
			},
		],
		unit: "",
		format: (data: any) =>
			`${data.medication}, ${data.dose}, ${data.frequency}`,
	},
	past_illnesses: {
		title: "Past Illnesses",
		fields: [
			{
				key: "condition",
				label: "Condition",
				type: "autocomplete",
				placeholder: "Start typing a condition name...",
				options: PREDEFINED_DISEASES,
			},
			{
				key: "diagnosed",
				label: "Diagnosed",
				type: "month",
				placeholder: "2023-01",
			},
		],
		unit: "",
		format: (data: any) => `${data.condition}, diagnosed ${data.diagnosed}`,
	},
};

export function MedicalRecordForm({
	isOpen,
	onClose,
	recordType,
	initialData,
	onSuccess,
}: MedicalRecordFormProps) {
	const [formData, setFormData] = useState<Record<string, any>>(() => {
		if (initialData?.value && typeof initialData.value === "object") {
			return initialData.value;
		}
		return {};
	});
	const [notes, setNotes] = useState(initialData?.notes || "");

	// Autocomplete state
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
	const upsertMutation = api.medicalRecord.upsert.useMutation({
		onSuccess: () => {
			toast.success("Medical record saved successfully");
			onSuccess?.();
			onClose();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to save medical record");
		},
	});

	if (!isOpen || !recordType) return null;

	const config =
		recordTypeConfigs[recordType as keyof typeof recordTypeConfigs];
	if (!config) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required fields
		const hasEmptyFields = config.fields.some(
			(field) =>
				field.type !== "select" &&
				(!formData[field.key] || formData[field.key] === ""),
		);

		if (hasEmptyFields) {
			toast.error("Please fill in all fields");
			return;
		}

		// Validate autocomplete fields (diseases must be from predefined list)
		if (recordType === "past_illnesses" && formData.condition) {
			if (!PREDEFINED_DISEASES.includes(formData.condition)) {
				toast.error("Please select a condition from the suggested list");
				return;
			}
		}

		upsertMutation.mutate({
			key: recordType as
				| "blood_pressure"
				| "heart_rate"
				| "blood_sugar"
				| "cholesterol"
				| "body_temperature"
				| "oxygen_saturation"
				| "weight"
				| "height"
				| "bmi"
				| "current_medications"
				| "past_illnesses",
			value: formData,
			unit: config.unit,
			notes: notes || undefined,
		});
	};

	const handleFieldChange = (fieldKey: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[fieldKey]: value,
		}));
	};

	const handleAutocompleteChange = (fieldKey: string, value: string) => {
		handleFieldChange(fieldKey, value);

		if (value.length > 0) {
			const filtered = PREDEFINED_DISEASES.filter((disease) =>
				disease.toLowerCase().includes(value.toLowerCase()),
			);
			setFilteredSuggestions(filtered);
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (fieldKey: string, suggestion: string) => {
		handleFieldChange(fieldKey, suggestion);
		setShowSuggestions(false);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
				<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
					{config.title}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{config.fields.map((field) => (
						<div key={field.key}>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								{field.label}
								{"unit" in field && field.unit && (
									<span className="text-slate-500 ml-1">({field.unit})</span>
								)}
							</label>

							{field.type === "select" ? (
								<select
									value={
										formData[field.key] ||
										("defaultValue" in field ? field.defaultValue : "") ||
										""
									}
									onChange={(e) => handleFieldChange(field.key, e.target.value)}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
									required
								>
									{"options" in field &&
										field.options?.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</select>
							) : field.type === "autocomplete" ? (
								<div className="relative">
									<Input
										type="text"
										placeholder={field.placeholder}
										value={formData[field.key] || ""}
										onChange={(e) =>
											handleAutocompleteChange(field.key, e.target.value)
										}
										onFocus={() => {
											if (formData[field.key]) {
												const filtered = PREDEFINED_DISEASES.filter((disease) =>
													disease
														.toLowerCase()
														.includes(formData[field.key].toLowerCase()),
												);
												setFilteredSuggestions(filtered);
												setShowSuggestions(true);
											}
										}}
										onBlur={() => {
											// Delay hiding suggestions to allow for clicks
											setTimeout(() => setShowSuggestions(false), 300);
										}}
										required
									/>
									{showSuggestions && filteredSuggestions.length > 0 && (
										<div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
											{filteredSuggestions.map((suggestion, index) => (
												<button
													key={index}
													type="button"
													className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 first:rounded-t-md last:rounded-b-md"
													onMouseDown={(e) => {
														// Prevent blur event when clicking
														e.preventDefault();
													}}
													onClick={() =>
														handleSuggestionClick(field.key, suggestion)
													}
												>
													{suggestion}
												</button>
											))}
										</div>
									)}
								</div>
							) : (
								<Input
									type={field.type}
									placeholder={field.placeholder}
									value={formData[field.key] || ""}
									onChange={(e) => handleFieldChange(field.key, e.target.value)}
									step={"step" in field ? field.step : undefined}
									min={"min" in field ? field.min : undefined}
									max={"max" in field ? field.max : undefined}
									required
								/>
							)}
						</div>
					))}

					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
							Notes (Optional)
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Add any additional notes..."
							className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
							rows={3}
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="secondary"
							onClick={onClose}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={upsertMutation.isPending}
							className="flex-1"
						>
							{upsertMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
