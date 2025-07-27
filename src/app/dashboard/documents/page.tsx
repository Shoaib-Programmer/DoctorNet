"use client";

import React, { useState } from "react";
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { DocumentList } from "@/components/documents/DocumentList";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { Upload, FileText, Camera, Scan } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type { Document } from "@prisma/client";

export default function DocumentsPage() {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

	// Get documents from tRPC
	const { data: documents = [], refetch } = api.document.getAll.useQuery();
	const deleteMutation = api.document.delete.useMutation({
		onSuccess: () => {
			toast.success("Document deleted successfully");
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete document");
		},
	});

	const handleUpload = async (file: File, description: string, category: string) => {
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
			refetch(); // Refresh the documents list
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

	const menuOptions = [
		{
			label: "Upload Document",
			onClick: () => {
				setUploadDialogOpen(true);
			},
			Icon: <Upload className="w-4 h-4" />,
		},
		// {
		// 	label: "Scan Document",
		// 	onClick: () => {
		// 		console.log("Scan document clicked");
		// 		toast.info("Document scanning feature coming soon!");
		// 	},
		// 	Icon: <Scan className="w-4 h-4" />,
		// },
		{
			label: "New Record",
			onClick: () => {
				console.log("New record clicked");
				toast.info("New medical record feature coming soon!");
			},
			Icon: <FileText className="w-4 h-4" />,
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
						Manage and organize your medical documents and records
					</p>

					{/* Documents List */}
					<DocumentList
						documents={documents}
						onDelete={handleDelete}
						onView={handleView}
					/>
				</div>
			</div>

			{/* Upload Dialog */}
			<UploadDialog
				isOpen={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleUpload}
			/>

			{/* Floating Action Menu */}
			<FloatingActionMenu options={menuOptions} />
		</div>
	);
}
