"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Brain,
	Heart,
	Utensils,
	Droplets,
	Bone,
	Calendar,
	Home,
	ArrowLeft,
	ArrowRight,
	Bot,
	MessageCircle,
	AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import expertData from "@/data/expert.json";

// Types
type BodyPart = "Head" | "Chest" | "Stomach" | "Urinary" | "Musculoskeletal";
type Severity = "mild" | "moderate" | "severe";
type Duration =
	| "within_hour"
	| "within_day"
	| "within_3_days"
	| "within_week"
	| "within_month"
	| "more_than_month"
	| "recurring";

interface ExpertCondition {
	name: string;
	body_part: string;
	symptom_sets: string[][];
	severity: string[];
	duration: string[];
	min_matches: number;
}

interface SymptomState {
	[key: string]: boolean;
}

interface ChatStep {
	type:
		| "greeting"
		| "main_options"
		| "body_part"
		| "symptoms"
		| "severity"
		| "duration"
		| "results";
	data?: any;
}

// Symptom mappings for each body part
const SYMPTOM_QUESTIONS = {
	Head: [
		{ id: "headache", label: "Do you have a headache?" },
		{ id: "dizziness", label: "Are you feeling dizzy or lightheaded?" },
		{ id: "blurred_vision", label: "Any blurred or double vision?" },
		{ id: "light_sensitivity", label: "Are you sensitive to light or sound?" },
		{ id: "head_injury", label: "Have you had any head injuries recently?" },
	],
	Chest: [
		{
			id: "breathing_difficulty",
			label: "Are you having difficulty breathing?",
		},
		{
			id: "chest_pain_tightness",
			label: "Do you feel chest pain or tightness?",
		},
		{ id: "cough", label: "Do you have a persistent cough?" },
		{ id: "mucus", label: "Are you coughing up mucus or blood?" },
		{
			id: "irregular_heartbeat",
			label: "Do you feel your heartbeat is irregular or too fast?",
		},
	],
	Stomach: [
		{
			id: "stomach_pain",
			label: "Are you experiencing stomach pain or cramps?",
		},
		{
			id: "nausea_vomiting",
			label: "Do you feel nauseous or have you vomited?",
		},
		{
			id: "diarrhea_constipation",
			label: "Have you had diarrhea or constipation?",
		},
		{ id: "eating_normally", label: "Are you able to eat normally?" },
		{
			id: "bloating",
			label: "Do you feel bloated or full even after small meals?",
		},
	],
	Urinary: [
		{
			id: "burning_urination",
			label: "Do you feel pain or burning when urinating?",
		},
		{
			id: "frequent_urination",
			label: "Are you needing to urinate more often than usual?",
		},
		{
			id: "cloudy_urine",
			label: "Is your urine dark, cloudy, or has a strong smell?",
		},
		{
			id: "bladder_not_empty",
			label: "Do you feel like your bladder doesn't fully empty?",
		},
		{ id: "blood_in_urine", label: "Have you noticed blood in your urine?" },
	],
	Musculoskeletal: [
		{
			id: "joint_muscle_pain",
			label: "Are you experiencing joint or muscle pain?",
		},
		{
			id: "swelling_stiffness",
			label: "Is there swelling or stiffness in any joints?",
		},
		{
			id: "limited_mobility",
			label: "Is the pain affecting your ability to move normally?",
		},
		{ id: "injury", label: "Did the pain start after a fall or injury?" },
		{
			id: "warmth_tenderness",
			label: "Do your joints feel warm or tender to touch?",
		},
	],
};

const BODY_PART_OPTIONS = [
	{
		id: "Head",
		icon: Brain,
		label: "Head",
		description: "headache, dizziness, vision, etc.",
	},
	{
		id: "Chest",
		icon: Heart,
		label: "Chest / Respiratory",
		description: "breathing, chest pain, cough",
	},
	{
		id: "Stomach",
		icon: Utensils,
		label: "Stomach / Digestive",
		description: "nausea, pain, diarrhea, etc.",
	},
	{
		id: "Urinary",
		icon: Droplets,
		label: "Urinary",
		description: "pain, frequent urination, etc.",
	},
	{
		id: "Musculoskeletal",
		icon: Bone,
		label: "Joints / Muscles",
		description: "pain, swelling, stiffness",
	},
];

const SEVERITY_OPTIONS = [
	{ id: "mild", emoji: "😌", label: "Mild" },
	{ id: "moderate", emoji: "😐", label: "Moderate" },
	{ id: "severe", emoji: "😣", label: "Severe" },
];

const DURATION_OPTIONS = [
	{ id: "within_hour", label: "Within the last hour" },
	{ id: "within_day", label: "Today only" },
	{ id: "within_3_days", label: "Within the last 3 days" },
	{ id: "within_week", label: "Within the last week" },
	{ id: "within_month", label: "Within the last month" },
	{ id: "more_than_month", label: "More than a month" },
	{ id: "recurring", label: "Recurring/comes and goes" },
];

export default function Expert() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<ChatStep>({
		type: "greeting",
	});
	const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(
		null,
	);
	const [symptoms, setSymptoms] = useState<SymptomState>({});
	const [severity, setSeverity] = useState<Severity | null>(null);
	const [duration, setDuration] = useState<Duration | null>(null);
	const [chatHistory, setChatHistory] = useState<
		Array<{ type: "bot" | "user"; message: string }>
	>([
		{ type: "bot", message: "Hi, I'm CareBot. Let's get you the right help." },
	]);

	const addToChatHistory = (type: "bot" | "user", message: string) => {
		setChatHistory((prev) => [...prev, { type, message }]);
	};

	// Map simplified symptoms to expert.json symptom IDs
	const mapSymptomsToExpertData = (userSymptoms: string[]) => {
		const expertSymptoms = new Set<string>();

		userSymptoms.forEach((symptom) => {
			switch (symptom) {
				// Head symptoms
				case "headache":
					expertSymptoms.add("headache");
					break;
				case "dizziness":
					expertSymptoms.add("dizziness");
					break;
				case "blurred_vision":
					expertSymptoms.add("blurred_vision");
					break;
				case "light_sensitivity":
					expertSymptoms.add("light_sensitivity");
					break;
				case "head_injury":
					expertSymptoms.add("head_injury");
					break;

				// Chest symptoms
				case "breathing_difficulty":
					expertSymptoms.add("breathing_difficulty");
					break;
				case "chest_pain_tightness":
					expertSymptoms.add("chest_pain");
					expertSymptoms.add("chest_tightness");
					break;
				case "cough":
					expertSymptoms.add("cough");
					expertSymptoms.add("dry_cough");
					break;
				case "mucus":
					expertSymptoms.add("mucus");
					// Add related symptoms that might be present with mucus
					expertSymptoms.add("fever");
					expertSymptoms.add("fatigue");
					break;
				case "irregular_heartbeat":
					expertSymptoms.add("irregular_heartbeat");
					break;

				// Stomach symptoms
				case "stomach_pain":
					expertSymptoms.add("stomach_pain");
					expertSymptoms.add("cramps");
					break;
				case "nausea_vomiting":
					expertSymptoms.add("nausea");
					expertSymptoms.add("vomiting");
					break;
				case "diarrhea_constipation":
					expertSymptoms.add("diarrhea");
					expertSymptoms.add("constipation");
					break;
				case "eating_normally":
					// Inverse mapping - if they can't eat normally
					if (!symptoms[symptom]) {
						expertSymptoms.add("loss_of_appetite");
					}
					break;
				case "bloating":
					expertSymptoms.add("bloating");
					expertSymptoms.add("gas");
					break;

				// Urinary symptoms
				case "burning_urination":
					expertSymptoms.add("burning_urination");
					expertSymptoms.add("urinary_pain");
					break;
				case "frequent_urination":
					expertSymptoms.add("frequent_urination");
					expertSymptoms.add("urgency");
					break;
				case "cloudy_urine":
					expertSymptoms.add("cloudy_urine");
					expertSymptoms.add("strong_urine_smell");
					break;
				case "bladder_not_empty":
					expertSymptoms.add("bladder_not_empty");
					break;
				case "blood_in_urine":
					expertSymptoms.add("blood_in_urine");
					// Add side pain often associated with blood in urine
					expertSymptoms.add("side_pain");
					expertSymptoms.add("sharp_pain");
					break;

				// Musculoskeletal symptoms
				case "joint_muscle_pain":
					expertSymptoms.add("joint_pain");
					expertSymptoms.add("muscle_pain");
					break;
				case "swelling_stiffness":
					expertSymptoms.add("swelling");
					expertSymptoms.add("stiffness");
					break;
				case "limited_mobility":
					expertSymptoms.add("limited_mobility");
					expertSymptoms.add("motion_pain");
					expertSymptoms.add("pain_with_movement");
					break;
				case "injury":
					expertSymptoms.add("injury");
					break;
				case "warmth_tenderness":
					expertSymptoms.add("warmth");
					expertSymptoms.add("tenderness");
					break;
			}
		});

		return Array.from(expertSymptoms);
	};

	const findMatchingConditions = (overrideDuration?: Duration) => {
		const currentDuration = overrideDuration || duration;
		if (!selectedBodyPart || !severity || !currentDuration) return [];

		const conditions = expertData.filter(
			(condition: ExpertCondition) => condition.body_part === selectedBodyPart,
		);

		const userSymptoms = Object.keys(symptoms).filter((key) => symptoms[key]);
		const mappedSymptoms = mapSymptomsToExpertData(userSymptoms);

		// Add logic for negative symptoms (tension headache)
		const negativeSymptoms = Object.keys(symptoms).filter(
			(key) => symptoms[key] === false,
		);
		negativeSymptoms.forEach((symptom) => {
			switch (symptom) {
				case "dizziness":
					mappedSymptoms.push("no_dizziness");
					break;
				case "light_sensitivity":
					mappedSymptoms.push("no_light_sensitivity");
					break;
				case "blurred_vision":
					mappedSymptoms.push("no_vision_issues");
					break;
			}
		});

		// Count how many positive symptoms the user actually has
		const userPositiveSymptomCount = userSymptoms.length;

		return conditions
			.filter((condition: ExpertCondition) => {
				// Check severity match
				if (!condition.severity.includes(severity)) return false;

				// Check duration match
				if (!condition.duration.includes(currentDuration)) return false;

				// Check symptom matches - updated for new JSON structure
				// symptom_sets now contains single arrays, not multiple arrays
				const symptomSet = condition.symptom_sets[0]; // Get the first (and only) symptom set
				if (!symptomSet) return false; // Safety check

				const matches = symptomSet.filter((symptom) =>
					mappedSymptoms.includes(symptom),
				).length;

				// Must meet the minimum match requirement AND user must have at least min_matches symptoms
				return (
					matches >= condition.min_matches &&
					userPositiveSymptomCount >= condition.min_matches
				);
			})
			.sort((a, b) => {
				// Sort by how many symptoms match
				const getMatchScore = (condition: ExpertCondition) => {
					const symptomSet = condition.symptom_sets[0]; // Get the first (and only) symptom set
					if (!symptomSet) return 0; // Safety check

					const matches = symptomSet.filter((symptom) =>
						mappedSymptoms.includes(symptom),
					).length;
					return matches;
				};
				return getMatchScore(b) - getMatchScore(a);
			});
	};

	const handleMainOption = (option: string) => {
		addToChatHistory("user", option);

		switch (option) {
			case "appointment":
				addToChatHistory("bot", "I'll redirect you to book an appointment.");
				router.push("/dashboard/appointments");
				break;
			case "home_care":
				addToChatHistory("bot", "Home care feature coming soon!");
				break;
			case "I'm not feeling well":
				addToChatHistory(
					"bot",
					"I'm sorry to hear you're not feeling well. Let's figure out what might be going on. Which part of your body is affected?",
				);
				setCurrentStep({ type: "body_part" });
				break;
		}
	};

	const handleBodyPartSelection = (bodyPart: BodyPart) => {
		setSelectedBodyPart(bodyPart);
		addToChatHistory("user", `${bodyPart} area`);
		addToChatHistory(
			"bot",
			`Let's check your ${bodyPart.toLowerCase()} symptoms. Please answer the following questions:`,
		);
		setCurrentStep({ type: "symptoms" });
	};

	const handleSymptomAnswer = (symptomId: string, answer: boolean) => {
		setSymptoms((prev) => ({ ...prev, [symptomId]: answer }));
	};

	const proceedToSeverity = () => {
		addToChatHistory(
			"bot",
			"How would you rate the severity of your symptoms?",
		);
		setCurrentStep({ type: "severity" });
	};

	const handleSeveritySelection = (selectedSeverity: Severity) => {
		setSeverity(selectedSeverity);
		addToChatHistory("user", `${selectedSeverity} severity`);
		addToChatHistory(
			"bot",
			"How long have you been experiencing these symptoms?",
		);
		setCurrentStep({ type: "duration" });
	};

	const handleDurationSelection = (selectedDuration: Duration) => {
		setDuration(selectedDuration);
		addToChatHistory(
			"user",
			DURATION_OPTIONS.find((d) => d.id === selectedDuration)?.label ||
				selectedDuration,
		);

		// Pass the selectedDuration directly to avoid state timing issues
		const matchingConditions = findMatchingConditions(selectedDuration);

		if (matchingConditions.length > 0) {
			const condition = matchingConditions[0];
			const isEmergency =
				condition?.name.includes("Heart Attack") ||
				condition?.name.includes("Appendicitis");

			addToChatHistory(
				"bot",
				`Based on your symptoms, this might be ${condition?.name.toLowerCase()}. ${isEmergency ? "⚠️ This requires immediate medical attention!" : "We recommend speaking to a doctor for proper care."}`,
			);
		} else {
			addToChatHistory(
				"bot",
				"I couldn't find a specific match for your symptoms. It's always best to consult with a healthcare professional for proper diagnosis.",
			);
		}

		setCurrentStep({ type: "results", data: matchingConditions });
	};

	const resetChat = () => {
		setCurrentStep({ type: "greeting" });
		setSelectedBodyPart(null);
		setSymptoms({});
		setSeverity(null);
		setDuration(null);
		setChatHistory([
			{
				type: "bot",
				message: "Hi, I'm CareBot. Let's get you the right help.",
			},
		]);
	};

	const renderStep = () => {
		switch (currentStep.type) {
			case "greeting":
				return (
					<div className="space-y-4">
						<div className="text-center space-y-4">
							<div className="text-6xl">🤖</div>
							<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
								CareBot
							</h2>
							<p className="text-slate-600 dark:text-slate-400">
								What do you need help with?
							</p>
						</div>

						<div className="space-y-3">
							<Button
								onClick={() => handleMainOption("appointment")}
								className="w-full flex items-center justify-start space-x-3 h-14 bg-emerald-600 hover:bg-emerald-700 text-white"
							>
								<Calendar className="w-5 h-5" />
								<span>🗓️ Book an appointment</span>
							</Button>

							<Button
								onClick={() => handleMainOption("I'm not feeling well")}
								variant="outline"
								className="w-full flex items-center justify-start space-x-3 h-14 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
							>
								<AlertTriangle className="w-5 h-5 text-red-600" />
								<span>🤒 I'm not feeling well</span>
							</Button>
						</div>
					</div>
				);

			case "body_part":
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
							Which part of your body is affected?
						</h3>
						<div className="grid grid-cols-1 gap-3">
							{BODY_PART_OPTIONS.map((option) => (
								<Button
									key={option.id}
									onClick={() => handleBodyPartSelection(option.id as BodyPart)}
									variant="outline"
									className="flex items-center justify-start space-x-3 h-20 p-4"
								>
									<option.icon className="w-6 h-6 text-emerald-600" />
									<div className="text-left">
										<div className="font-medium">{option.label}</div>
										<div className="text-sm text-slate-500">
											{option.description}
										</div>
									</div>
								</Button>
							))}
						</div>
					</div>
				);

			case "symptoms":
				if (!selectedBodyPart) return null;

				const symptomQuestions = SYMPTOM_QUESTIONS[selectedBodyPart];

				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
							{selectedBodyPart} Symptoms
						</h3>
						<div className="space-y-3">
							{symptomQuestions.map((question) => (
								<div
									key={question.id}
									className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
								>
									<p className="text-slate-700 dark:text-slate-300 mb-3">
										{question.label}
									</p>
									<div className="flex space-x-2">
										<Button
											onClick={() => handleSymptomAnswer(question.id, true)}
											variant={
												symptoms[question.id] === true ? "default" : "outline"
											}
											size="sm"
											className={
												symptoms[question.id] === true
													? "bg-emerald-600 hover:bg-emerald-700"
													: ""
											}
										>
											Yes
										</Button>
										<Button
											onClick={() => handleSymptomAnswer(question.id, false)}
											variant={
												symptoms[question.id] === false ? "default" : "outline"
											}
											size="sm"
											className={
												symptoms[question.id] === false
													? "bg-slate-600 hover:bg-slate-700"
													: ""
											}
										>
											No
										</Button>
									</div>
								</div>
							))}
						</div>

						<div className="flex justify-center pt-4">
							<Button
								onClick={proceedToSeverity}
								className="bg-emerald-600 hover:bg-emerald-700 text-white"
								disabled={Object.keys(symptoms).length === 0}
							>
								Next: Rate Severity
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				);

			case "severity":
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
							How would you rate the severity?
						</h3>
						<div className="grid grid-cols-1 gap-3">
							{SEVERITY_OPTIONS.map((option) => (
								<Button
									key={option.id}
									onClick={() => handleSeveritySelection(option.id as Severity)}
									variant="outline"
									className="flex items-center justify-center space-x-3 h-16 text-lg"
								>
									<span className="text-2xl">{option.emoji}</span>
									<span>{option.label}</span>
								</Button>
							))}
						</div>
					</div>
				);

			case "duration":
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
							How long have you been experiencing these symptoms?
						</h3>
						<div className="grid grid-cols-1 gap-2">
							{DURATION_OPTIONS.map((option) => (
								<Button
									key={option.id}
									onClick={() => handleDurationSelection(option.id as Duration)}
									variant="outline"
									className="h-12 justify-start"
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				);

			case "results":
				const conditions = currentStep.data || [];

				return (
					<div className="space-y-6">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
								Assessment Results
							</h3>

							{conditions.length > 0 ? (
								<div className="space-y-4">
									{conditions
										.slice(0, 2)
										.map((condition: ExpertCondition, index: number) => (
											<div
												key={condition.name}
												className="border rounded-lg p-4 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
											>
												<h4 className="font-semibold text-slate-800 dark:text-slate-100">
													{condition.name}
												</h4>
											</div>
										))}

									<div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
										*This is not a medical diagnosis. Please consult a
										healthcare professional.
									</div>
								</div>
							) : (
								<div className="text-slate-600 dark:text-slate-400">
									<p>
										No specific condition identified based on your symptoms.
									</p>
									<p className="text-sm mt-2">
										Please consult with a healthcare professional for proper
										evaluation.
									</p>
								</div>
							)}
						</div>

						<div className="space-y-3">
							<Button
								onClick={() => router.push("/dashboard/appointments")}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
							>
								<Calendar className="w-4 h-4 mr-2" />
								Book an Appointment
							</Button>

							<Button onClick={resetChat} variant="outline" className="w-full">
								Start New Assessment
							</Button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/20">
			<div className="p-6">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<Bot className="w-8 h-8 text-emerald-600" />
							<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
								Expert System
							</h1>
						</div>
						<p className="text-slate-600 dark:text-slate-400">
							AI-powered symptom checker and healthcare guidance
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Chat History */}
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-96 overflow-y-auto">
							<div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
								<MessageCircle className="w-5 h-5 text-emerald-600" />
								<h3 className="font-semibold text-slate-800 dark:text-slate-100">
									Conversation
								</h3>
							</div>

							<div className="space-y-3">
								{chatHistory.map((message, index) => (
									<div
										key={index}
										className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[80%] p-3 rounded-lg ${
												message.type === "user"
													? "bg-emerald-600 text-white"
													: "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
											}`}
										>
											<p className="text-sm">{message.message}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Current Step */}
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
							{currentStep.type !== "greeting" && (
								<div className="flex items-center space-x-2 mb-4">
									<Button
										onClick={() => {
											if (currentStep.type === "symptoms") {
												setCurrentStep({ type: "body_part" });
											} else if (currentStep.type === "severity") {
												setCurrentStep({ type: "symptoms" });
											} else if (currentStep.type === "duration") {
												setCurrentStep({ type: "severity" });
											} else if (currentStep.type === "results") {
												setCurrentStep({ type: "duration" });
											} else {
												setCurrentStep({ type: "greeting" });
											}
										}}
										variant="ghost"
										size="sm"
									>
										<ArrowLeft className="w-4 h-4 mr-1" />
										Back
									</Button>
								</div>
							)}

							{renderStep()}
						</div>
					</div>

					{/* Disclaimer */}
					<div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
									Medical Disclaimer
								</h3>
								<p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
									This tool is for informational purposes only and does not
									provide medical advice. Always consult with a qualified
									healthcare professional for proper diagnosis and treatment. In
									case of emergency, call your local emergency services
									immediately.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
