"use client";

import React, { useState } from "react";
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { DocumentList } from "@/components/documents/DocumentList";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { MedicalRecordsList } from "@/components/medical-records/MedicalRecordsList";
import { MedicalRecordSelector } from "@/components/medical-records/MedicalRecordSelector";
import { MedicalRecordForm } from "@/components/medical-records/MedicalRecordForm";
import { Upload, FileText, Camera, Scan, Activity } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type { Document } from "@prisma/client";

export default function DocumentsPage() {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null,
	);
	const [activeTab, setActiveTab] = useState<"documents" | "records">(
		"documents",
	);

	// Medical Records state
	const [recordSelectorOpen, setRecordSelectorOpen] = useState(false);
	const [recordFormOpen, setRecordFormOpen] = useState(false);
	const [selectedRecordType, setSelectedRecordType] = useState<string | null>(
		null,
	);
	const [editingRecord, setEditingRecord] = useState<any>(null);

	// Get documents from tRPC
	const { data: documents = [], refetch: refetchDocuments } =
		api.document.getAll.useQuery();
	const deleteMutation = api.document.delete.useMutation({
		onSuccess: () => {
			toast.success("Document deleted successfully");
			refetchDocuments();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete document");
		},
	});

	// Get medical records from tRPC
	const { data: medicalRecords = [], refetch: refetchMedicalRecords } =
		api.medicalRecord.getAll.useQuery();

	const handleUpload = async (
		file: File,
		description: string,
		category: string,
	) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("description", description);
			formData.append("category", category);

			const response = await fetch("/api/documents/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Upload failed");
			}

			const result = await response.json();
			toast.success("Document uploaded successfully");
			refetchDocuments(); // Refresh the documents list
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(error instanceof Error ? error.message : "Upload failed");
			throw error;
		}
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this document?")) {
			deleteMutation.mutate({ id });
		}
	};

	const handleView = (document: Document) => {
		// Open document in new tab
		window.open(document.url, "_blank");
	};

	const handleRecordTypeSelect = (recordType: string) => {
		setSelectedRecordType(recordType);
		setEditingRecord(null);
		setRecordFormOpen(true);
	};

	const handleEditRecord = (recordType: string, record: any) => {
		setSelectedRecordType(recordType);
		setEditingRecord(record);
		setRecordFormOpen(true);
	};

	const menuOptions = [
		{
			label: "Upload Document",
			onClick: () => {
				setUploadDialogOpen(true);
			},
			Icon: <Upload className="w-4 h-4" />,
		},
		{
			label: "New Record",
			onClick: () => {
				setRecordSelectorOpen(true);
			},
			Icon: <Activity className="w-4 h-4" />,
		},
		{
			label: "Take Photo",
			onClick: () => {
				console.log("Take photo clicked");
				toast.info("Camera functionality coming soon!");
			},
			Icon: <Camera className="w-4 h-4" />,
		},
	];

	return (
		<div className="w-full h-full bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			{/* Page Content */}
			<div className="p-6">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
						Medical Records
					</h1>
					<p className="text-slate-600 dark:text-slate-400 mb-8">
						Manage and organize your medical documents and health records
					</p>

					{/* Tab Navigation */}
					<div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
						<button
							onClick={() => setActiveTab("documents")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								activeTab === "documents"
									? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
									: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
							}`}
						>
							Documents ({documents.length})
						</button>
						<button
							onClick={() => setActiveTab("records")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								activeTab === "records"
									? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
									: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
							}`}
						>
							Health Records ({medicalRecords.length})
						</button>
					</div>

					{/* Content based on active tab */}
					{activeTab === "documents" ? (
						<DocumentList
							documents={documents}
							onDelete={handleDelete}
							onView={handleView}
						/>
					) : (
						<MedicalRecordsList
							records={medicalRecords}
							onEdit={handleEditRecord}
							onRefresh={refetchMedicalRecords}
						/>
					)}
				</div>
			</div>

			{/* Upload Dialog */}
			<UploadDialog
				isOpen={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleUpload}
			/>

			{/* Medical Record Selector */}
			<MedicalRecordSelector
				isOpen={recordSelectorOpen}
				onClose={() => setRecordSelectorOpen(false)}
				onSelect={handleRecordTypeSelect}
			/>

			{/* Medical Record Form */}
			<MedicalRecordForm
				isOpen={recordFormOpen}
				onClose={() => {
					setRecordFormOpen(false);
					setSelectedRecordType(null);
					setEditingRecord(null);
				}}
				recordType={selectedRecordType}
				initialData={editingRecord}
				onSuccess={refetchMedicalRecords}
			/>

			{/* Floating Action Menu */}
			<FloatingActionMenu options={menuOptions} />
		</div>
	);
}
