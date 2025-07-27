import React, { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

interface UploadDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onUpload: (
		file: File,
		description: string,
		category: string,
	) => Promise<void>;
}

export function UploadDialog({ isOpen, onClose, onUpload }: UploadDialogProps) {
	const [file, setFile] = useState<File | null>(null);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const categories = [
		{ value: "XRAY", label: "X-Ray" },
		{ value: "MRI_CT_SCAN", label: "MRI / CT Scans" },
		{ value: "ULTRASOUND_REPORT", label: "Ultrasound Reports" },
		{ value: "ECG_EKG_REPORT", label: "ECG / EKG Reports" },
		{
			value: "LAB_TEST_REPORT",
			label: "Lab Test Reports (Blood, Urine, etc.)",
		},
		{ value: "PRESCRIPTION", label: "Medical Prescriptions" },
		{ value: "REFERRAL_LETTER", label: "Referral Letters / Doctor Notes" },
		{ value: "SURGERY_RECORD", label: "Surgery Records" },
		{ value: "VACCINATION_CERTIFICATE", label: "Vaccination Certificates" },
		{ value: "COVID_TEST_RESULT", label: "COVID-19 Test Results" },
		{ value: "INSURANCE_DOCUMENT", label: "Insurance Documents" },
		{ value: "OTHER", label: "Other" },
	];

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setIsUploading(true);
		try {
			await onUpload(file, description, category);
			handleClose();
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleClose = () => {
		setFile(null);
		setDescription("");
		setCategory("");
		setIsUploading(false);
		onClose();
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getPlaceholderForCategory = (category: string) => {
		const placeholders: Record<string, string> = {
			XRAY: "e.g., Chest X-ray, date of examination, findings...",
			MRI_CT_SCAN: "e.g., Brain MRI, CT scan of abdomen, date, findings...",
			ULTRASOUND_REPORT: "e.g., Pregnancy ultrasound, abdominal ultrasound...",
			ECG_EKG_REPORT: "e.g., Resting ECG, stress test results...",
			LAB_TEST_REPORT:
				"e.g., Complete blood count, glucose test, cholesterol panel...",
			PRESCRIPTION: "e.g., Medication name, dosage, prescribing doctor...",
			REFERRAL_LETTER:
				"e.g., Referral to cardiologist, specialist consultation...",
			SURGERY_RECORD:
				"e.g., Appendectomy, procedure notes, recovery details...",
			VACCINATION_CERTIFICATE:
				"e.g., COVID-19 vaccine, flu shot, travel vaccines...",
			COVID_TEST_RESULT: "e.g., PCR test, rapid antigen test, test date...",
			INSURANCE_DOCUMENT: "e.g., Insurance card, policy details, claims...",
			OTHER: "Add a description for this document...",
		};

		return placeholders[category] || "Add a description for this document...";
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md max-h-[90vh] my-8 flex flex-col">
				<div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
						Upload Document
					</h2>
					<button
						onClick={handleClose}
						className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
					{/* File Upload Area */}
					<div
						className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
							dragActive
								? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
								: "border-slate-300 dark:border-slate-600"
						}`}
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					>
						{file ? (
							<div className="space-y-2">
								<FileText className="w-12 h-12 mx-auto text-emerald-500" />
								<div>
									<p className="font-medium text-slate-900 dark:text-slate-100">
										{file.name}
									</p>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										{formatFileSize(file.size)}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setFile(null)}
									className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
								>
									Remove file
								</button>
							</div>
						) : (
							<>
								<Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
								<div>
									<p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
										Drop your file here
									</p>
									<p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
										or click to browse
									</p>
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
									>
										Choose File
									</button>
								</div>
							</>
						)}
					</div>

					<input
						ref={fileInputRef}
						type="file"
						onChange={handleFileSelect}
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.tiff,.bmp,.txt,.rtf,.csv,.xls,.xlsx,.dcm"
						className="hidden"
					/>

					{/* File size warning */}
					<div className="mt-3 flex items-start space-x-2 text-sm text-amber-600 dark:text-amber-400">
						<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
						<span>
							Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG,
							PNG, GIF, WebP, TIFF, BMP, TXT, RTF, CSV, XLS, XLSX, DICOM
						</span>
					</div>

					{/* Category Selection */}
					<div className="mt-6">
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Category
						</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							required
						>
							<option value="" disabled>
								Choose a category
							</option>
							{categories.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
					</div>

					{/* Description */}
					<div className="mt-4">
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Description (optional)
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							placeholder={getPlaceholderForCategory(category)}
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
							disabled={isUploading}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!file || !category || isUploading}
							className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isUploading ? "Uploading..." : "Upload"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
