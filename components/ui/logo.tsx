"use client"

import { Calendar } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
	variant?: "default" | "compact"
	className?: string
	href?: string | null
}

export function Logo({ variant = "default", className, href = "/" }: LogoProps) {
	const logoContent = (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center">
				<Calendar className="w-6 h-6 text-white" />
			</div>
			{variant === "default" && (
				<span
					className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
					style={{ fontFamily: "var(--font-space-grotesk)" }}
				>
					Reebooking
				</span>
			)}
		</div>
	)

	if (href) {
		return (
			<Link href={href} className="flex items-center">
				{logoContent}
			</Link>
		)
	}

	return logoContent
}

