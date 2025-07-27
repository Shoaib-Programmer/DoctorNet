import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const doctors = [
	{
		name: "Dr. Sarah Johnson",
		specialty: "Cardiology",
		email: "sarah.johnson@hospital.com",
		phone: "+1-555-0101",
		bio: "Experienced cardiologist with over 15 years of practice. Specializes in preventive cardiology and heart disease management.",
		image:
			"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
	{
		name: "Dr. Michael Chen",
		specialty: "Orthopedics",
		email: "michael.chen@hospital.com",
		phone: "+1-555-0102",
		bio: "Orthopedic surgeon specializing in sports medicine and joint replacement surgery.",
		image:
			"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
	{
		name: "Dr. Emily Rodriguez",
		specialty: "Dermatology",
		email: "emily.rodriguez@hospital.com",
		phone: "+1-555-0103",
		bio: "Board-certified dermatologist with expertise in skin cancer detection and cosmetic dermatology.",
		image:
			"https://images.unsplash.com/photo-1594824804732-ca8db5456275?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
	{
		name: "Dr. David Wilson",
		specialty: "Neurology",
		email: "david.wilson@hospital.com",
		phone: "+1-555-0104",
		bio: "Neurologist specializing in epilepsy, stroke treatment, and neurodegenerative diseases.",
		image:
			"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
	{
		name: "Dr. Lisa Thompson",
		specialty: "Pediatrics",
		email: "lisa.thompson@hospital.com",
		phone: "+1-555-0105",
		bio: "Pediatrician with 12 years of experience in child healthcare and development.",
		image:
			"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
	{
		name: "Dr. Robert Kim",
		specialty: "Gastroenterology",
		email: "robert.kim@hospital.com",
		phone: "+1-555-0106",
		bio: "Gastroenterologist specializing in digestive disorders and endoscopic procedures.",
		image:
			"https://images.unsplash.com/photo-1612349316932-1dfe3b8c7606?w=400&h=400&fit=crop&crop=face",
		isAvailable: true,
	},
];

const defaultAvailability = [
	{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, // Monday
	{ dayOfWeek: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
	{ dayOfWeek: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
	{ dayOfWeek: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
	{ dayOfWeek: 5, startTime: "09:00", endTime: "15:00" }, // Friday
];

async function main() {
	console.log("Seeding database with doctors...");

	for (const doctorData of doctors) {
		const doctor = await prisma.doctor.create({
			data: doctorData,
		});

		// Add availability for each doctor
		for (const availability of defaultAvailability) {
			await prisma.doctorAvailability.create({
				data: {
					doctorId: doctor.id,
					...availability,
				},
			});
		}

		console.log(`Created doctor: ${doctor.name}`);
	}

	console.log("Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
