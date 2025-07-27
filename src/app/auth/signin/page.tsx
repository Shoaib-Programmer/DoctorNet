"use client";

import { useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleCredentialsSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid email or password");
			} else {
				router.push("/");
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
								<div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-lg">T3</span>
								</div>
							</a>
						</div>
						<h1 className="text-3xl font-semibold">Sign In</h1>
					</div>

					<form
						onSubmit={handleCredentialsSignIn}
						className="flex w-full flex-col gap-8"
					>
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

							{error && (
								<div className="text-red-500 text-sm text-center">{error}</div>
							)}

							<div className="flex flex-col gap-4">
								<Button
									type="submit"
									className="mt-2 w-full"
									disabled={isLoading}
								>
									{isLoading ? "Signing in..." : "Sign In"}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
								>
									<FcGoogle className="mr-2 size-5" />
									Sign in with Google
								</Button>
							</div>
						</div>
					</form>

					<div className="text-muted-foreground flex justify-center gap-1 text-sm">
						<p>Don't have an account?</p>
						<a
							href="/auth/signup"
							className="text-primary font-medium hover:underline"
						>
							Sign up
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
