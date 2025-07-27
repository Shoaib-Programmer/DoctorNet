import React from "react";
import { format } from "date-fns";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import type { Document } from "@prisma/client";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onView: (document: Document) => void;
}

export function DocumentList({ documents, onDelete, onView }: DocumentListProps) {
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "XRAY":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MRI_CT_SCAN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "ULTRASOUND_REPORT":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "ECG_EKG_REPORT":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "LAB_TEST_REPORT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "PRESCRIPTION":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REFERRAL_LETTER":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "SURGERY_RECORD":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "VACCINATION_CERTIFICATE":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "COVID_TEST_RESULT":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      case "INSURANCE_DOCUMENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      XRAY: "X-rays",
      MRI_CT_SCAN: "MRI / CT Scans",
      ULTRASOUND_REPORT: "Ultrasound Reports",
      ECG_EKG_REPORT: "ECG / EKG Reports",
      LAB_TEST_REPORT: "Lab Test Reports",
      PRESCRIPTION: "Medical Prescriptions",
      REFERRAL_LETTER: "Referral Letters",
      SURGERY_RECORD: "Surgery Records",
      VACCINATION_CERTIFICATE: "Vaccination Certificates",
      COVID_TEST_RESULT: "COVID-19 Test Results",
      INSURANCE_DOCUMENT: "Insurance Documents",
      OTHER: "Other"
    };
    
    return categoryMap[category] || category.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <FileText className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p>Use the floating menu to upload your first medical document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {document.originalName}
                </h3>
                {document.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {document.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                      document.category
                    )}`}
                  >
                    {formatCategory(document.category)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(document.fileSize)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(document.uploadedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onView(document)}
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </button>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Download document"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => onDelete(document.id)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
