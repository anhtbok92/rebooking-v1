import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Zap, Code2 } from "lucide-react"

export function Introduction() {
	return (
		<section id="introduction" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Reebooking - Luxury Spa Booking System</CardTitle>
					<CardDescription className="text-base">
						A modern, full-featured booking system for spa and salon businesses built with Next.js 16, TypeScript,
						Prisma, and PostgreSQL.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="text-xl font-semibold mb-4">Key Highlights</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Code2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Modern Tech Stack</h4>
									<p className="text-sm text-muted-foreground">
										Built with Next.js 16, React 19, TypeScript, and Tailwind CSS
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Full-Stack Solution</h4>
									<p className="text-sm text-muted-foreground">Complete frontend and backend in one application</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Role-Based Access</h4>
									<p className="text-sm text-muted-foreground">
										Support for Super Admin, Admin, Staff, and Client roles
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">AI-Powered</h4>
									<p className="text-sm text-muted-foreground">
										OpenAI integration for recommendations and availability
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 pt-4 border-t">
						<Badge variant="secondary">Next.js 16</Badge>
						<Badge variant="secondary">TypeScript</Badge>
						<Badge variant="secondary">Prisma</Badge>
						<Badge variant="secondary">PostgreSQL</Badge>
						<Badge variant="secondary">Stripe</Badge>
						<Badge variant="secondary">Cloudinary</Badge>
						<Badge variant="secondary">NextAuth</Badge>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

