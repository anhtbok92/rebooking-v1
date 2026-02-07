import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Computer, Globe, MousePointerClick } from "lucide-react"

export function GettingStarted() {
	return (
		<section id="getting-started" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Getting Started</CardTitle>
					<CardDescription className="text-base">
						Everything you need to know before installing the system
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="text-xl font-semibold mb-4">What You Need Before Starting</h3>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Computer className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">A Computer</h4>
									<p className="text-sm text-muted-foreground">Windows, Mac, or Linux</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<Globe className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Internet Connection</h4>
									<p className="text-sm text-muted-foreground">For downloading and setup</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<MousePointerClick className="w-5 h-5 text-primary mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Basic Computer Skills</h4>
									<p className="text-sm text-muted-foreground">Opening files, typing, clicking</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-4">What This System Requires</h3>
						<div className="space-y-3">
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Node.js (version 18 or higher)</h4>
									<p className="text-sm text-muted-foreground">
										A program that runs the system. Download from{" "}
										<a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
											nodejs.org
										</a>
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">PostgreSQL Database</h4>
									<p className="text-sm text-muted-foreground">
										Where your data is stored. Can be local or cloud-hosted (Supabase, Neon, Railway)
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
								<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold mb-1">Code Editor (Optional)</h4>
									<p className="text-sm text-muted-foreground">
										To view and edit files. VS Code is recommended but any text editor works
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
						<p className="text-sm font-medium">
							<strong>Don't worry!</strong> We'll guide you through installing everything step by step.
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

