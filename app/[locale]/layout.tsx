import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "../globals.css"

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
	weight: ["700"],
})

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
	title: "Reebooking - Service Appointment Booking scheduling system Full Stack Application",
	description: "Book your appointment with ease using Reebooking",
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
			</head>
			<body className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SessionProvider>
						<ReduxProvider>
							<NextIntlClientProvider locale={locale} messages={messages}>
								<Suspense fallback={null}>{children}</Suspense>
							</NextIntlClientProvider>
						</ReduxProvider>
					</SessionProvider>
					<Toaster position="bottom-left" richColors />
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
