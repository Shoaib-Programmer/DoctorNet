import { MoveRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
	session: any;
}

function Hero({ session }: HeroProps) {
	return (
		<div className="w-full py-12 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
					<div className="flex gap-4 flex-col">
						<div className="flex gap-4 flex-col">
							<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl max-w-lg tracking-tighter text-left font-regular">
								DoctorNet
							</h1>
							<p className="text-lg sm:text-xl leading-relaxed tracking-tight max-w-md text-left text-slate-300 text-balance">
								An all-in-one app where users can book doctor appointments, and
								store all their medical information.
							</p>
						</div>
						<div className="flex flex-row gap-4">
							<Link href={session ? "/dashboard" : "/auth/signup"}>
								<Button
									size="lg"
									className="gap-4 bg-emerald-500 hover:bg-emerald-600 text-white"
								>
									{session ? "Go to Dashboard" : "Sign up here"}{" "}
									<MoveRight className="w-4 h-4" />
								</Button>
							</Link>
						</div>
					</div>
					<div className="flex justify-center lg:justify-center">
						<Image
							src="/doctor.png"
							alt="Doctor"
							className="bg-transparent rounded-md"
							width="435"
							height="435"
						></Image>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Hero };
