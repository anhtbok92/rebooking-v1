import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, ArrowRight } from "lucide-react"

export function QuickStart() {
	const steps = [
		{
			time: "2 minutes",
			title: "Install Dependencies",
			command: "npm install",
		},
		{
			time: "1 minute",
			title: "Set Up Database",
			details: [
				"Create PostgreSQL database: createdb reebooking",
				"Create .env file with minimum required variables",
				"Run migrations: npx prisma migrate dev && npx prisma generate",
			],
		},
		{
			time: "1 minute",
			title: "Create Admin User",
			details: [
				"Run: npx prisma studio",
				"Go to User table → Add record",
				"Add email, hashed password, role: SUPER_ADMIN, name",
			],
		},
		{
			time: "1 minute",
			title: "Start the App",
			command: "npm run dev",
			note: "Visit http://localhost:3000 and login",
		},
	]

	return (
		<section id="quick-start" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl flex items-center gap-2">
						<Clock className="w-6 h-6" />
						Quick Start Guide
					</CardTitle>
					<CardDescription>Get your booking system up and running in 5 minutes!</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-2 mb-6">
						<Badge variant="default" className="text-lg px-3 py-1">
							⚡ Fast Setup (5 Minutes)
						</Badge>
					</div>

					<div className="space-y-6">
						{steps.map((step, idx) => (
							<div key={idx} className="relative">
								<div className="flex items-start gap-4">
									<div className="flex flex-col items-center">
										<div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
											{idx + 1}
										</div>
										{idx < steps.length - 1 && (
											<div className="w-0.5 h-full min-h-[4rem] bg-border mt-2" />
										)}
									</div>
									<div className="flex-1 pb-6">
										<div className="flex items-center gap-2 mb-2">
											<h4 className="font-semibold text-lg">{step.title}</h4>
											<Badge variant="outline" className="text-xs">
												{step.time}
											</Badge>
										</div>
										{step.command && (
											<div className="bg-muted p-3 rounded-lg mb-2">
												<code className="text-sm">{step.command}</code>
											</div>
										)}
										{step.details && (
											<ul className="space-y-1 text-sm text-muted-foreground">
												{step.details.map((detail, detailIdx) => (
													<li key={detailIdx} className="flex items-start gap-2">
														<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
														<span>{detail}</span>
													</li>
												))}
											</ul>
										)}
										{step.note && (
											<p className="text-sm text-muted-foreground mt-2 italic">{step.note}</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
						<h4 className="font-semibold mb-3 flex items-center gap-2">
							<ArrowRight className="w-5 h-5" />
							Next Steps
						</h4>
						<ul className="space-y-2 text-sm">
							<li className="flex items-start gap-2">
								<CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
								<span>Add Services: Go to Admin Dashboard → Services → Add Service</span>
							</li>
							<li className="flex items-start gap-2">
								<CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
								<span>Test Booking: Go to homepage → Select service → Book appointment</span>
							</li>
							<li className="flex items-start gap-2">
								<CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
								<span>Configure Integrations (Optional): Cloudinary, Stripe, Twilio</span>
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

