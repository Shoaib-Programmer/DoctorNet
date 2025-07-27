import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
} from "@/server/api/trpc";

export const doctorRouter = createTRPCRouter({
	getAllDoctors: publicProcedure.query(async ({ ctx }) => {
		console.log("getAllDoctors called, ctx.db exists:", !!ctx.db);

		try {
			const doctors = await ctx.db.doctor.findMany({
				where: {
					isAvailable: true,
				},
				include: {
					availability: true,
					_count: {
						select: {
							appointments: {
								where: {
									status: "CONFIRMED",
								},
							},
						},
					},
				},
				orderBy: {
					name: "asc",
				},
			});

			console.log("Found doctors:", doctors.length);
			return doctors;
		} catch (error) {
			console.error("Error fetching doctors:", error);
			throw error;
		}
	}),

	getDoctorById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.doctor.findUnique({
				where: {
					id: input.id,
				},
				include: {
					availability: true,
					appointments: {
						where: {
							status: "CONFIRMED",
						},
						select: {
							proposedAt: true,
						},
					},
				},
			});
		}),

	getDoctorsBySpecialty: publicProcedure
		.input(z.object({ specialty: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.doctor.findMany({
				where: {
					specialty: {
						contains: input.specialty,
						// Note: SQLite doesn't support mode: "insensitive"
					},
					isAvailable: true,
				},
				include: {
					availability: true,
					_count: {
						select: {
							appointments: {
								where: {
									status: "CONFIRMED",
								},
							},
						},
					},
				},
			});
		}),

	getAvailableTimeSlots: publicProcedure
		.input(
			z.object({
				doctorId: z.string(),
				date: z.string(), // YYYY-MM-DD format
			}),
		)
		.query(async ({ ctx, input }) => {
			const doctor = await ctx.db.doctor.findUnique({
				where: { id: input.doctorId },
				include: {
					availability: true,
					appointments: {
						where: {
							proposedAt: {
								gte: new Date(input.date + "T00:00:00.000Z"),
								lt: new Date(input.date + "T23:59:59.999Z"),
							},
							status: {
								in: ["CONFIRMED", "PENDING"],
							},
						},
					},
				},
			});

			if (!doctor) {
				throw new Error("Doctor not found");
			}

			const dayOfWeek = new Date(input.date).getDay();
			const dayAvailability = doctor.availability.find(
				(avail) => avail.dayOfWeek === dayOfWeek,
			);

			if (!dayAvailability) {
				return [];
			}

			// Generate time slots (30-minute intervals)
			const timeSlots = [];
			const startHour = parseInt(dayAvailability.startTime.split(":")[0]!);
			const endHour = parseInt(dayAvailability.endTime.split(":")[0]!);

			for (let hour = startHour; hour < endHour; hour++) {
				for (let minute = 0; minute < 60; minute += 30) {
					const timeString = `${hour.toString().padStart(2, "0")}:${minute
						.toString()
						.padStart(2, "0")}`;
					const slotDateTime = new Date(`${input.date}T${timeString}:00.000Z`);

					// Check if slot is already booked
					const isBooked = doctor.appointments.some((appointment) => {
						const appointmentTime = new Date(appointment.proposedAt);
						return appointmentTime.getTime() === slotDateTime.getTime();
					});

					if (!isBooked && slotDateTime > new Date()) {
						timeSlots.push({
							time: timeString,
							datetime: slotDateTime,
							available: true,
						});
					}
				}
			}

			return timeSlots;
		}),
});
