"use client";

import React from 'react';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import { Upload, FileText, Camera, Scan } from 'lucide-react';

export default function DocumentsPage() {
  const menuOptions = [
    {
      label: "Upload Document",
      onClick: () => {
        console.log("Upload document clicked");
        // TODO: Implement document upload functionality
      },
      Icon: <Upload className="w-4 h-4" />,
    },
    {
      label: "Scan Document",
      onClick: () => {
        console.log("Scan document clicked");
        // TODO: Implement document scanning functionality
      },
      Icon: <Scan className="w-4 h-4" />,
    },
    {
      label: "New Record",
      onClick: () => {
        console.log("New record clicked");
        // TODO: Implement new medical record creation
      },
      Icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "Take Photo",
      onClick: () => {
        console.log("Take photo clicked");
        // TODO: Implement camera functionality
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
          
          {/* Placeholder content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p>Use the floating menu to upload your first medical document</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu options={menuOptions} />
    </div>
  );
}
