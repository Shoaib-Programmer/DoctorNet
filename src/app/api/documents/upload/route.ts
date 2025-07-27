import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { env } from "@/env";

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		const description = formData.get("description") as string | null;
		const category = formData.get("category") as string | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate file size (10MB limit)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: "File size exceeds 10MB limit" },
				{ status: 400 },
			);
		}

		// Validate file type (allow various medical document formats)
		const allowedTypes = [
			// Images (for scanned documents, X-rays, etc.)
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/tiff",
			"image/bmp",
			// Documents
			"application/pdf",
			"text/plain",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			// DICOM files (common for medical imaging)
			"application/dicom",
			// Additional medical formats
			"application/rtf",
			"text/csv",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		];

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: "File type not supported" },
				{ status: 400 },
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const fileName = `${timestamp}_${sanitizedName}`;

		// Upload to Vercel Blob
		const blob = await put(fileName, file, {
			access: "public",
			token: env.BLOB_READ_WRITE_TOKEN,
		});

		// Save to database
		const document = await db.document.create({
			data: {
				userId: session.user.id,
				fileName,
				originalName: file.name,
				fileSize: file.size,
				mimeType: file.type,
				url: blob.url,
				description: description || null,
				category: (category as any) || "GENERAL",
			},
		});

		return NextResponse.json({
			success: true,
			document: {
				id: document.id,
				fileName: document.fileName,
				originalName: document.originalName,
				url: document.url,
				description: document.description,
				category: document.category,
				uploadedAt: document.uploadedAt,
			},
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
