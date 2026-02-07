"use client"

import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export function SimpleFooter() {
	return (
		<footer className="bg-card fixed bottom-0 w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-2">
						{/* <Logo /> */}
						<span className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} Reebooking. All rights reserved.
						</span>
					</div>
					<div className="flex items-center gap-6 text-sm">
						<Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
							Documentation
						</Link>
						<Link href="/signin" className="text-muted-foreground hover:text-primary transition-colors">
							Sign In
						</Link>
						<Link href="/demo" className="text-muted-foreground hover:text-primary transition-colors">
							Demo
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

