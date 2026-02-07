import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, Cloud, CreditCard, MessageSquare, Sparkles, Mail } from "lucide-react"

export function Configuration() {
	return (
		<section id="configuration" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Configuration</CardTitle>
					<CardDescription className="text-base">
						Environment variables and third-party service setup
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="env" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="env">Environment Variables</TabsTrigger>
							<TabsTrigger value="services">Third-Party Services</TabsTrigger>
						</TabsList>

						<TabsContent value="env" className="space-y-6 mt-6">
							<div>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<Key className="w-5 h-5" />
									Required Variables
								</h3>
								<div className="space-y-3">
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">DATABASE_URL</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">PostgreSQL connection string</p>
											<code className="text-xs bg-muted p-2 rounded block">
												postgresql://user:password@localhost:5432/reebooking
											</code>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">NEXTAUTH_URL</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">Your application URL</p>
											<code className="text-xs bg-muted p-2 rounded block">http://localhost:3000</code>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">NEXTAUTH_SECRET</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">
												Secret key for NextAuth (generate with <code className="text-xs">openssl rand -base64 32</code>)
											</p>
											<code className="text-xs bg-muted p-2 rounded block">Random 32-character string</code>
										</CardContent>
									</Card>
								</div>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-4">Optional Variables</h3>
								<div className="grid gap-3 md:grid-cols-2">
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">Cloudinary</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">For photo uploads</p>
											<Badge variant="outline" className="text-xs">Optional</Badge>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">Stripe</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">For online payments</p>
											<Badge variant="outline" className="text-xs">Optional</Badge>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">Twilio</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">For WhatsApp notifications</p>
											<Badge variant="outline" className="text-xs">Optional</Badge>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">OpenAI</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">For AI features</p>
											<Badge variant="outline" className="text-xs">Optional</Badge>
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="services" className="space-y-6 mt-6">
							<div className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Cloud className="w-5 h-5" />
											Cloudinary (Photo Uploads)
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">
											Allows customers to upload inspiration photos with bookings.
										</p>
										<div>
											<p className="text-sm font-semibold mb-1">Setup:</p>
											<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
												<li>Sign up at cloudinary.com (free account available)</li>
												<li>Get Cloud Name, API Key, and API Secret from dashboard</li>
												<li>Add to .env file</li>
												<li>Create upload preset named "jobtree"</li>
											</ol>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<CreditCard className="w-5 h-5" />
											Stripe (Payments)
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">Process credit card payments securely.</p>
										<div>
											<p className="text-sm font-semibold mb-1">Setup:</p>
											<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
												<li>Sign up at stripe.com</li>
												<li>Get API keys from dashboard (use test keys for development)</li>
												<li>Add to .env file</li>
												<li>Configure webhook endpoint for automatic confirmations</li>
											</ol>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<MessageSquare className="w-5 h-5" />
											Twilio (WhatsApp)
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">Send booking confirmations via WhatsApp automatically.</p>
										<div>
											<p className="text-sm font-semibold mb-1">Setup:</p>
											<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
												<li>Sign up at twilio.com</li>
												<li>Get a WhatsApp-enabled phone number</li>
												<li>Copy Account SID, Auth Token, and WhatsApp number</li>
												<li>Add to .env file</li>
											</ol>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Sparkles className="w-5 h-5" />
											OpenAI (AI Features)
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">
											Provides smart service recommendations and availability suggestions.
										</p>
										<div>
											<p className="text-sm font-semibold mb-1">Setup:</p>
											<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
												<li>Sign up at platform.openai.com</li>
												<li>Create an API key</li>
												<li>Add to .env file as OPENAI_API_KEY</li>
											</ol>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Mail className="w-5 h-5" />
											Resend (Email Service)
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">
											Send transactional emails (booking confirmations, password resets, etc.).
										</p>
										<div>
											<p className="text-sm font-semibold mb-1">Setup:</p>
											<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
												<li>Sign up at resend.com</li>
												<li>Create an API key</li>
												<li>Add to .env file</li>
											</ol>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>
	)
}

