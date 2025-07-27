import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				fullName: true,
				dateOfBirth: true,
				gender: true,
				height: true,
				weight: true,
				bloodType: true,
				allergies: true,
				medications: true,
				medicalHistory: true,
				emergencyContact: true,
				phoneNumber: true,
				address: true,
				onboardingCompleted: true,
			},
		});
	}),

	updateMedicalInfo: protectedProcedure
		.input(
			z.object({
				fullName: z.string().min(1, "Full name is required"),
				dateOfBirth: z.date(),
				gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
				height: z.number().min(50).max(300), // cm
				weight: z.number().min(20).max(500), // kg
				bloodType: z.enum([
					"A+",
					"A-",
					"B+",
					"B-",
					"AB+",
					"AB-",
					"O+",
					"O-",
					"unknown",
				]),
				allergies: z.array(z.string()).optional(),
				medications: z.array(z.string()).optional(),
				medicalHistory: z.array(z.string()).optional(),
				emergencyContact: z.object({
					name: z.string().min(1, "Emergency contact name is required"),
					phone: z.string().min(1, "Emergency contact phone is required"),
					relationship: z.string().min(1, "Relationship is required"),
				}),
				phoneNumber: z.string().min(1, "Phone number is required"),
				address: z.string().min(1, "Address is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					fullName: input.fullName,
					dateOfBirth: input.dateOfBirth,
					gender: input.gender,
					height: input.height,
					weight: input.weight,
					bloodType: input.bloodType,
					allergies: JSON.stringify(input.allergies || []),
					medications: JSON.stringify(input.medications || []),
					medicalHistory: JSON.stringify(input.medicalHistory || []),
					emergencyContact: JSON.stringify(input.emergencyContact),
					phoneNumber: input.phoneNumber,
					address: input.address,
					onboardingCompleted: true,
				},
			});
		}),

	checkOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
			select: {
				onboardingCompleted: true,
			},
		});

		return user?.onboardingCompleted || false;
	}),
});
