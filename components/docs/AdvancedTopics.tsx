import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Rocket, Shield } from "lucide-react"

export function AdvancedTopics() {
	return (
		<section id="advanced-topics" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Advanced Topics</CardTitle>
					<CardDescription className="text-base">
						Customization, deployment, and security best practices
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="customization" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="customization">Customization</TabsTrigger>
							<TabsTrigger value="deployment">Deployment</TabsTrigger>
							<TabsTrigger value="security">Security</TabsTrigger>
						</TabsList>

						<TabsContent value="customization" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Palette className="w-5 h-5" />
										Change Brand Colors
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-3">Edit app/globals.css:</p>
									<code className="text-xs bg-muted p-3 rounded block">
										{`:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* Add your colors here */
}`}
									</code>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Change App Name</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
										<li>app/layout.tsx - Update metadata title</li>
										<li>components/layout/landing/header.tsx - Update logo text</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Add New Service Types</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Services are managed through Admin Dashboard → Services. No code changes needed.
									</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="deployment" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Rocket className="w-5 h-5" />
										Deploy to Vercel
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
										<li>Push code to GitHub</li>
										<li>Import project in Vercel</li>
										<li>Add environment variables</li>
										<li>Deploy</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Deploy to Other Platforms</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 text-sm text-muted-foreground">
										<div>
											<strong>Railway:</strong> Connect GitHub repo, add env vars
										</div>
										<div>
											<strong>Render:</strong> Connect repo, set build command: npm run build
										</div>
										<div>
											<strong>DigitalOcean:</strong> Use App Platform
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="security" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Shield className="w-5 h-5" />
										Security Best Practices
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
										<li><strong>Never commit .env file</strong> - It contains secrets</li>
										<li><strong>Use strong passwords</strong> - For database and admin accounts</li>
										<li><strong>Enable HTTPS</strong> - In production</li>
										<li><strong>Regular backups</strong> - Backup your database regularly</li>
										<li><strong>Update dependencies</strong> - Keep packages updated</li>
									</ol>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

