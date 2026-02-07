"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
	const router = useRouter()

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<div className="text-center max-w-2xl mx-auto">
				{/* 404 Number */}
				<div className="mb-8">
					<h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 leading-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						404
					</h1>
				</div>

				{/* Error Message */}
				<div className="mb-8">
					<h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						Page Not Found
					</h2>
					<p className="text-lg text-muted-foreground mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
						Oops! The page you&apos;re looking for doesn&apos;t exist.
					</p>
					<p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
						It might have been moved, deleted, or the URL might be incorrect.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link href="/">
						<Button size="lg" className="gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
							<Home className="w-4 h-4" />
							Go to Homepage
						</Button>
					</Link>
					<Button
						size="lg"
						variant="outline"
						className="gap-2"
						onClick={() => router.back()}
						style={{ fontFamily: "var(--font-dm-sans)" }}
					>
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</Button>
				</div>

				{/* Helpful Links */}
				<div className="mt-12 pt-8 border-t border-border">
					<p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
						You might be looking for:
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Link href="/" className="text-sm text-primary hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
							Book Appointment
						</Link>
						<Link href="/cart" className="text-sm text-primary hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
							View Cart
						</Link>
						<Link href="/docs" className="text-sm text-primary hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
							Documentation
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

