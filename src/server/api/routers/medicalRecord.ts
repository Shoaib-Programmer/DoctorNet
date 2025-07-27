import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Define the medical record types and their validation schemas
const medicalRecordSchema = z.object({
	key: z.enum([
		"blood_pressure",
		"heart_rate",
		"blood_sugar",
		"cholesterol",
		"body_temperature",
		"oxygen_saturation",
		"weight",
		"height",
		"bmi",
		"current_medications",
		"past_illnesses",
	]),
	value: z.string(),
	unit: z.string().optional(),
	notes: z.string().optional(),
	recordedAt: z.date().optional(),
});

export const medicalRecordRouter = createTRPCRouter({
	// Get all medical records for the current user
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const records = await ctx.db.medicalRecord.findMany({
			where: { userId: ctx.session.user.id },
			orderBy: { updatedAt: "desc" },
		});

		// Parse the JSON values
		return records.map((record) => ({
			...record,
			value: JSON.parse(record.value),
		}));
	}),

	// Get a specific medical record by key
	getByKey: protectedProcedure
		.input(z.object({ key: z.string() }))
		.query(async ({ ctx, input }) => {
			const record = await ctx.db.medicalRecord.findUnique({
				where: {
					userId_key: {
						userId: ctx.session.user.id,
						key: input.key,
					},
				},
			});

			if (!record) return null;

			return {
				...record,
				value: JSON.parse(record.value),
			};
		}),

	// Create or update a medical record
	upsert: protectedProcedure
		.input(medicalRecordSchema)
		.mutation(async ({ ctx, input }) => {
			const { key, value, unit, notes, recordedAt } = input;

			return ctx.db.medicalRecord.upsert({
				where: {
					userId_key: {
						userId: ctx.session.user.id,
						key,
					},
				},
				update: {
					value: JSON.stringify(value),
					unit,
					notes,
					recordedAt: recordedAt || new Date(),
					updatedAt: new Date(),
				},
				create: {
					userId: ctx.session.user.id,
					key,
					value: JSON.stringify(value),
					unit,
					notes,
					recordedAt: recordedAt || new Date(),
				},
			});
		}),

	// Delete a medical record
	delete: protectedProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const record = await ctx.db.medicalRecord.findUnique({
				where: {
					userId_key: {
						userId: ctx.session.user.id,
						key: input.key,
					},
				},
			});

			if (!record) {
				throw new Error("Medical record not found or access denied");
			}

			await ctx.db.medicalRecord.delete({
				where: {
					userId_key: {
						userId: ctx.session.user.id,
						key: input.key,
					},
				},
			});

			return { success: true };
		}),

	// Get medical records summary/dashboard data
	getSummary: protectedProcedure.query(async ({ ctx }) => {
		const records = await ctx.db.medicalRecord.findMany({
			where: { userId: ctx.session.user.id },
			orderBy: { updatedAt: "desc" },
		});

		const summary = records.reduce(
			(acc, record) => {
				acc[record.key] = {
					...record,
					value: JSON.parse(record.value),
				};
				return acc;
			},
			{} as Record<string, any>,
		);

		return summary;
	}),
});
