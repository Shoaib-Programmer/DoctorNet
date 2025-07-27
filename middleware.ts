import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const session = await auth();
	const { pathname } = request.nextUrl;

	// Protected routes that require authentication
	const protectedRoutes = ["/dashboard"];

	// Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// If accessing a protected route without a session, redirect to sign-in
	if (isProtectedRoute && !session?.user) {
		const signInUrl = new URL("/auth/signin", request.url);
		signInUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(signInUrl);
	}

	// If already logged in and trying to access auth pages, redirect to dashboard
	if (session?.user && pathname.startsWith("/auth/")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/auth/:path*"],
};
