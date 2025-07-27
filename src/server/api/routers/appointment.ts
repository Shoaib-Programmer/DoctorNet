import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const appointmentRouter = createTRPCRouter({
	getMyAppointments: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.appointment.findMany({
			where: {
				patientId: ctx.session.user.id,
			},
			include: {
				doctor: {
					select: {
						id: true,
						name: true,
						specialty: true,
						image: true,
					},
				},
				negotiations: {
					orderBy: {
						createdAt: "desc",
					},
				},
			},
			orderBy: {
				proposedAt: "asc",
			},
		});
	}),

	createAppointment: protectedProcedure
		.input(
			z.object({
				doctorId: z.string(),
				proposedAt: z.date(),
				notes: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if the time slot is still available
			const existingAppointment = await ctx.db.appointment.findFirst({
				where: {
					doctorId: input.doctorId,
					proposedAt: input.proposedAt,
					status: {
						in: ["CONFIRMED", "PENDING"],
					},
				},
			});

			if (existingAppointment) {
				throw new Error("This time slot is no longer available");
			}

			return ctx.db.appointment.create({
				data: {
					patientId: ctx.session.user.id,
					doctorId: input.doctorId,
					proposedAt: input.proposedAt,
					notes: input.notes,
					status: "PENDING",
				},
				include: {
					doctor: {
						select: {
							id: true,
							name: true,
							specialty: true,
							image: true,
						},
					},
				},
			});
		}),

	updateAppointmentStatus: protectedProcedure
		.input(
			z.object({
				appointmentId: z.string(),
				status: z.enum(["CONFIRMED", "CANCELLED"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify the appointment belongs to the user
			const appointment = await ctx.db.appointment.findUnique({
				where: { id: input.appointmentId },
			});

			if (!appointment || appointment.patientId !== ctx.session.user.id) {
				throw new Error("Appointment not found");
			}

			return ctx.db.appointment.update({
				where: { id: input.appointmentId },
				data: { status: input.status },
				include: {
					doctor: {
						select: {
							id: true,
							name: true,
							specialty: true,
							image: true,
						},
					},
				},
			});
		}),

	negotiateAppointment: protectedProcedure
		.input(
			z.object({
				appointmentId: z.string(),
				proposedAt: z.date(),
				message: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify the appointment belongs to the user
			const appointment = await ctx.db.appointment.findUnique({
				where: { id: input.appointmentId },
			});

			if (!appointment || appointment.patientId !== ctx.session.user.id) {
				throw new Error("Appointment not found");
			}

			// Update the appointment status to negotiating
			await ctx.db.appointment.update({
				where: { id: input.appointmentId },
				data: {
					status: "NEGOTIATING",
					proposedAt: input.proposedAt,
				},
			});

			// Create a negotiation record
			return ctx.db.appointmentNegotiation.create({
				data: {
					appointmentId: input.appointmentId,
					proposedBy: "PATIENT",
					proposedAt: input.proposedAt,
					message: input.message,
					status: "PENDING",
				},
			});
		}),

	cancelAppointment: protectedProcedure
		.input(z.object({ appointmentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify the appointment belongs to the user
			const appointment = await ctx.db.appointment.findUnique({
				where: { id: input.appointmentId },
			});

			if (!appointment || appointment.patientId !== ctx.session.user.id) {
				throw new Error("Appointment not found");
			}

			return ctx.db.appointment.update({
				where: { id: input.appointmentId },
				data: { status: "CANCELLED" },
				include: {
					doctor: {
						select: {
							id: true,
							name: true,
							specialty: true,
							image: true,
						},
					},
				},
			});
		}),

	getAppointmentById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const appointment = await ctx.db.appointment.findUnique({
				where: { id: input.id },
				include: {
					doctor: true,
					patient: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					negotiations: {
						orderBy: {
							createdAt: "desc",
						},
					},
				},
			});

			if (!appointment || appointment.patientId !== ctx.session.user.id) {
				throw new Error("Appointment not found");
			}

			return appointment;
		}),
});
