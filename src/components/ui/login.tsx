import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Login1Props {
	heading?: string;
	logo: {
		url: string;
		src: string;
		alt: string;
		title?: string;
	};
	buttonText?: string;
	googleText?: string;
	signupText?: string;
	signupUrl?: string;
}

const Login1 = ({
	heading,
	logo = {
		url: "https://www.shadcnblocks.com",
		src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-wordmark.svg",
		alt: "logo",
		title: "shadcnblocks.com",
	},
	buttonText = "Login",
	googleText = "Sign up with Google",
	signupText = "Don't have an account?",
	signupUrl = "https://shadcnblocks.com",
}: Login1Props) => {
	return (
		<section className="bg-muted h-screen">
			<div className="flex h-full items-center justify-center">
				<div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
					<div className="flex flex-col items-center gap-y-2">
						{/* Logo */}
						<div className="flex items-center gap-1 lg:justify-start">
							<a href={logo.url}>
								<img
									src={logo.src}
									alt={logo.alt}
									title={logo.title}
									className="h-10 dark:invert"
								/>
							</a>
						</div>
						{heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
					</div>
					<div className="flex w-full flex-col gap-8">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<Input type="email" placeholder="Email" required />
							</div>
							<div className="flex flex-col gap-2">
								<Input type="password" placeholder="Password" required />
							</div>
							<div className="flex flex-col gap-4">
								<Button type="submit" className="mt-2 w-full">
									{buttonText}
								</Button>
								<Button variant="outline" className="w-full">
									<FcGoogle className="mr-2 size-5" />
									{googleText}
								</Button>
							</div>
						</div>
					</div>
					<div className="text-muted-foreground flex justify-center gap-1 text-sm">
						<p>{signupText}</p>
						<a
							href={signupUrl}
							className="text-primary font-medium hover:underline"
						>
							Sign up
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export { Login1 };
