"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (response.ok) {
				// Auto sign in after successful registration
				const result = await signIn("credentials", {
					email,
					password,
					redirect: false,
				});

				if (result?.ok) {
					router.push("/");
				} else {
					router.push("/auth/signin");
				}
			} else {
				const data = await response.json();
				setError(data.error || "An error occurred during registration");
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", { callbackUrl: "/" });
		} catch (error) {
			setError("An error occurred with Google sign in.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="bg-background h-screen">
			<div className="flex h-full items-center justify-center">
				<div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
					<div className="flex flex-col items-center gap-y-2">
						{/* Logo */}
						<div className="flex items-center gap-1 lg:justify-start">
							<a href="/">
								<div className="h-16 w-16 relative">
									<Image
										src="/logo.png"
										alt="DoctorNet Logo"
										fill
										className="object-contain"
										priority
									/>
								</div>
							</a>
						</div>
						<h1 className="text-3xl font-semibold">Sign Up</h1>
					</div>

					<form onSubmit={handleSignUp} className="flex w-full flex-col gap-8">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<Input
									type="email"
									placeholder="Email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Input
									type="password"
									placeholder="Password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Input
									type="password"
									placeholder="Confirm Password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									disabled={isLoading}
								/>
							</div>

							{error && (
								<div className="text-red-500 text-sm text-center">{error}</div>
							)}

							<div className="flex flex-col gap-4">
								<Button
									type="submit"
									className="mt-2 w-full"
									disabled={isLoading}
								>
									{isLoading ? "Creating account..." : "Sign Up"}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
								>
									<FcGoogle className="mr-2 size-5" />
									Sign up with Google
								</Button>
							</div>
						</div>
					</form>

					<div className="text-muted-foreground flex justify-center gap-1 text-sm">
						<p>Already have an account?</p>
						<a
							href="/auth/signin"
							className="text-primary font-medium hover:underline"
						>
							Sign in
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
