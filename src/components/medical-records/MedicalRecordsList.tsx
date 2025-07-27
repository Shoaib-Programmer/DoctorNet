import React from "react";
import { format } from "date-fns";
import {
	Edit,
	Trash2,
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
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface MedicalRecordsListProps {
	records: any[];
	onEdit: (recordType: string, record: any) => void;
	onRefresh: () => void;
}

const recordTypeConfigs = {
	blood_pressure: {
		title: "Blood Pressure",
		icon: <Activity className="w-5 h-5" />,
		color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
		formatValue: (value: any) => `${value.systolic}/${value.diastolic} mmHg`,
	},
	heart_rate: {
		title: "Heart Rate",
		icon: <Heart className="w-5 h-5" />,
		color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
		formatValue: (value: any) => `${value.rate} bpm`,
	},
	blood_sugar: {
		title: "Blood Sugar",
		icon: <Droplet className="w-5 h-5" />,
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
		formatValue: (value: any) => `${value.level} mg/dL`,
	},
	cholesterol: {
		title: "Cholesterol",
		icon: <Activity className="w-5 h-5" />,
		color:
			"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
		formatValue: (value: any) =>
			`Total: ${value.total}, LDL: ${value.ldl}, HDL: ${value.hdl}, Triglycerides: ${value.triglycerides}`,
	},
	body_temperature: {
		title: "Body Temperature",
		icon: <Thermometer className="w-5 h-5" />,
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
		formatValue: (value: any) => `${value.temperature}${value.unit}`,
	},
	oxygen_saturation: {
		title: "Oxygen Saturation",
		icon: <Activity className="w-5 h-5" />,
		color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
		formatValue: (value: any) => `${value.saturation}%`,
	},
	weight: {
		title: "Weight",
		icon: <Scale className="w-5 h-5" />,
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
		formatValue: (value: any) => `${value.weight} kg`,
	},
	height: {
		title: "Height",
		icon: <Ruler className="w-5 h-5" />,
		color:
			"bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
		formatValue: (value: any) => `${value.height} cm`,
	},
	bmi: {
		title: "BMI",
		icon: <Calculator className="w-5 h-5" />,
		color:
			"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
		formatValue: (value: any) => `${value.bmi}`,
	},
	current_medications: {
		title: "Current Medications",
		icon: <Pill className="w-5 h-5" />,
		color:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
		formatValue: (value: any) =>
			`${value.medication}, ${value.dose}, ${value.frequency}`,
	},
	past_illnesses: {
		title: "Past Illnesses",
		icon: <FileText className="w-5 h-5" />,
		color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
		formatValue: (value: any) =>
			`${value.condition}, diagnosed ${value.diagnosed}`,
	},
};

export function MedicalRecordsList({
	records,
	onEdit,
	onRefresh,
}: MedicalRecordsListProps) {
	const deleteMutation = api.medicalRecord.delete.useMutation({
		onSuccess: () => {
			toast.success("Medical record deleted successfully");
			onRefresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete medical record");
		},
	});

	const handleDelete = (key: string) => {
		if (confirm("Are you sure you want to delete this medical record?")) {
			deleteMutation.mutate({ key });
		}
	};

	if (records.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
					<Activity className="w-8 h-8 text-slate-400" />
				</div>
				<h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
					No Medical Records
				</h3>
				<p className="text-slate-600 dark:text-slate-400">
					Start tracking your health by adding your first medical record.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{records.map((record) => {
				const config =
					recordTypeConfigs[record.key as keyof typeof recordTypeConfigs];
				if (!config) return null;

				return (
					<div
						key={record.id}
						className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${config.color}`}>
									{config.icon}
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">
										{config.title}
									</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										{format(new Date(record.recordedAt), "MMM dd, yyyy")}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onEdit(record.key, record)}
									className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
								>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleDelete(record.key)}
									className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100"
									disabled={deleteMutation.isPending}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<div className="text-lg font-medium text-slate-900 dark:text-slate-100">
								{config.formatValue(record.value)}
							</div>
							{record.notes && (
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{record.notes}
								</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
