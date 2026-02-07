"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Circle } from "lucide-react"

export function Checklist() {
	const preInstallation = [
		"Node.js 18+ installed (node --version)",
		"npm or yarn installed (npm --version)",
		"PostgreSQL installed and running",
		"Git installed (for cloning)",
		"Code editor ready (VS Code recommended)",
	]

	const installation = [
		"Repository cloned to local machine",
		"Navigated to project directory (cd reebooking)",
		"Dependencies installed (npm install)",
		"No errors during installation",
	]

	const environment = [
		".env file created in root directory",
		"DATABASE_URL configured",
		"DIRECT_URL configured (same as DATABASE_URL)",
		"NEXTAUTH_URL set to http://localhost:3000",
		"NEXTAUTH_SECRET generated and added",
		"All required variables filled in",
	]

	const database = [
		"PostgreSQL database created (reeooking)",
		"Database connection tested",
		"Prisma migrations run (npx prisma migrate dev)",
		"Prisma client generated (npx prisma generate)",
		"Database tables created successfully",
		"Prisma Studio opens without errors (npx prisma studio)",
	]

	const admin = [
		"Admin user created in database",
		"Password hashed correctly",
		"Role set to SUPER_ADMIN",
		"Can login with admin credentials",
	]

	const testing = [
		"Development server starts (npm run dev)",
		"Application loads at http://localhost:3000",
		"No console errors in browser",
		"Can access homepage",
		"Can login with admin account",
		"Admin dashboard accessible",
	]

	return (
		<section id="checklist" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Installation Checklist</CardTitle>
					<CardDescription>Use this checklist to ensure you've completed all setup steps correctly</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="pre-installation" className="w-full">
						<TabsList className="grid w-full grid-cols-6">
							<TabsTrigger value="pre-installation" className="text-xs">
								Pre-Install
							</TabsTrigger>
							<TabsTrigger value="installation" className="text-xs">
								Install
							</TabsTrigger>
							<TabsTrigger value="environment" className="text-xs">
								Environment
							</TabsTrigger>
							<TabsTrigger value="database" className="text-xs">
								Database
							</TabsTrigger>
							<TabsTrigger value="admin" className="text-xs">
								Admin
							</TabsTrigger>
							<TabsTrigger value="testing" className="text-xs">
								Testing
							</TabsTrigger>
						</TabsList>

						<TabsContent value="pre-installation" className="mt-6">
							<div className="space-y-3">
								{preInstallation.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>

						<TabsContent value="installation" className="mt-6">
							<div className="space-y-3">
								{installation.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>

						<TabsContent value="environment" className="mt-6">
							<div className="space-y-3">
								{environment.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>

						<TabsContent value="database" className="mt-6">
							<div className="space-y-3">
								{database.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>

						<TabsContent value="admin" className="mt-6">
							<div className="space-y-3">
								{admin.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>

						<TabsContent value="testing" className="mt-6">
							<div className="space-y-3">
								{testing.map((item, idx) => (
									<ChecklistItem key={idx} label={item} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

function ChecklistItem({ label }: { label: string }) {
	return (
		<div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
			<Checkbox id={label} />
			<Label htmlFor={label} className="text-sm font-normal cursor-pointer flex-1">
				{label}
			</Label>
		</div>
	)
}

