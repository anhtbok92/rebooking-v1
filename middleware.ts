import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import jwt from "jsonwebtoken"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { JWT } from "next-auth/jwt"

const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// 1. Handle i18n routing
	const response = handleI18nRouting(request)

	// 2. Auth logic
	// Get the path without the locale prefix for checking protected routes
	const path = pathname.replace(/^\/(en|vi)/, "") || "/"
	const locale = pathname.startsWith("/en") ? "en" : "vi"

	let token: JWT | null = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

	// ✅ Support mobile (Bearer token)
	if (!token) {
		const authHeader = request.headers.get("authorization")
		if (authHeader?.startsWith("Bearer ")) {
			const bearerToken = authHeader.split(" ")[1]
			try {
				const verified = jwt.verify(bearerToken, process.env.NEXTAUTH_SECRET as string)
				if (typeof verified === "object" && verified !== null) {
					token = verified as JWT
				}
			} catch {
				token = null
			}
		}
	}

	// 🚫 Protected routes
	const isProtectedRoute =
		path.startsWith("/admin") || path.startsWith("/staff") || path.startsWith("/dashboard")

	if (isProtectedRoute) {
		if (!token) {
			const signInUrl = new URL(`/${locale}/signin`, request.url)
			return NextResponse.redirect(signInUrl)
		}

		const role = token.role as string | undefined

		// SUPER ADMIN only
		if (path.startsWith("/admin/super") && role !== "SUPER_ADMIN") {
			return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
		}

		// ADMIN & SUPER ADMIN
		if (
			path.startsWith("/admin") &&
			!path.startsWith("/admin/super") &&
			(!role || !["ADMIN", "SUPER_ADMIN"].includes(role))
		) {
			return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
		}

		// STAFF only
		if (path.startsWith("/staff") && role !== "STAFF") {
			return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
		}
	}

	return response
}

export const config = {
	// Matcher ignoring `/_next` and `/api`
	matcher: ["/((?!api|_next|.*\\..*).*)"],
}
