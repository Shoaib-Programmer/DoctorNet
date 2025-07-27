import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "DoctorNet",
	description: "DoctorNet - Your Personal Healthcare Assistant",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 5,
		userScalable: true,
	},
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
				<SessionProvider>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
