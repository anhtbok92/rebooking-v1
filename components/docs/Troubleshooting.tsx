import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Troubleshooting() {
	const issues = [
		{
			title: "Cannot connect to database",
			symptoms: ["Error: Can't reach database server", "Application won't start"],
			solutions: [
				"Check PostgreSQL is running",
				"Verify DATABASE_URL in .env is correct",
				"Check username and password",
				"For cloud databases, check IP whitelist",
			],
		},
		{
			title: "Port 3000 already in use",
			symptoms: ["Error when running npm run dev", "Port already occupied"],
			solutions: [
				"Windows: netstat -ano | findstr :3000, then taskkill /PID <PID> /F",
				"Mac/Linux: lsof -ti:3000 | xargs kill",
				"Or use different port: PORT=3001 npm run dev",
			],
		},
		{
			title: "Prisma Client not generated",
			symptoms: ["Error: @prisma/client did not initialize yet"],
			solutions: ["Run: npx prisma generate"],
		},
		{
			title: "Module not found",
			symptoms: ["Error: Cannot find module '...'"],
			solutions: [
				"Delete node_modules and package-lock.json",
				"Run: npm install",
			],
		},
		{
			title: "Environment variables not loading",
			symptoms: ["Variables not working", "Connection errors"],
			solutions: [
				"Ensure .env file is in root directory",
				"Restart development server after changing .env",
				"Check for typos in variable names",
				"No spaces around = in .env",
			],
		},
		{
			title: "Ratings not showing",
			symptoms: ["Ratings submitted but not visible"],
			solutions: [
				"Check rating status (must be APPROVED)",
				"Admin must approve ratings in Admin Dashboard → Ratings",
				"Only APPROVED ratings show to public",
			],
		},
		{
			title: "Calendar not loading bookings",
			symptoms: ["Calendar shows but no bookings"],
			solutions: [
				"Check user has bookings",
				"Verify date filter (try 'All Bookings')",
				"Check browser console for errors",
				"Verify API is working: /api/v1/bookings",
			],
		},
	]

	return (
		<section id="troubleshooting" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Troubleshooting</CardTitle>
					<CardDescription className="text-base">
						Common issues and their solutions
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{issues.map((issue, idx) => (
						<Card key={idx}>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<AlertCircle className="w-5 h-5 text-orange-500" />
									{issue.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<p className="text-sm font-semibold mb-2 flex items-center gap-2">
										<XCircle className="w-4 h-4 text-red-500" />
										Symptoms:
									</p>
									<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
										{issue.symptoms.map((symptom, i) => (
											<li key={i}>{symptom}</li>
										))}
									</ul>
								</div>
								<div>
									<p className="text-sm font-semibold mb-2 flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4 text-green-500" />
										Solutions:
									</p>
									<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
										{issue.solutions.map((solution, i) => (
											<li key={i}>{solution}</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</section>
	)
}

