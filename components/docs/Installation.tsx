import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Installation() {
	return (
		<section id="installation" className="scroll-mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Installation</CardTitle>
					<CardDescription>Step-by-step guide to get your booking system up and running</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-green-500" />
								<span>Node.js 18.x or higher</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-green-500" />
								<span>npm or yarn package manager</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-green-500" />
								<span>PostgreSQL database (local or cloud-hosted)</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-green-500" />
								<span>Git for version control</span>
							</div>
						</div>
					</div>

					<Tabs defaultValue="step1" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="step1">Step 1</TabsTrigger>
							<TabsTrigger value="step2">Step 2</TabsTrigger>
							<TabsTrigger value="step3">Step 3</TabsTrigger>
							<TabsTrigger value="step4">Step 4</TabsTrigger>
							<TabsTrigger value="step5">Step 5</TabsTrigger>
						</TabsList>

						<TabsContent value="step1" className="space-y-4 mt-4">
							<h4 className="font-semibold text-lg">Clone the Repository</h4>
							<div className="bg-muted p-4 rounded-lg">
								<code className="text-sm">
									git clone &lt;your-repository-url&gt;
									<br />
									cd reebooking
								</code>
							</div>
						</TabsContent>

						<TabsContent value="step2" className="space-y-4 mt-4">
							<h4 className="font-semibold text-lg">Install Dependencies</h4>
							<div className="bg-muted p-4 rounded-lg">
								<code className="text-sm">npm install</code>
							</div>
							<p className="text-sm text-muted-foreground">This will install all required packages. This may take a few minutes.</p>
						</TabsContent>

						<TabsContent value="step3" className="space-y-4 mt-4">
							<h4 className="font-semibold text-lg">Set Up Environment Variables</h4>
							<p className="text-sm text-muted-foreground mb-2">Create a `.env` file in the root directory:</p>
							<div className="bg-muted p-4 rounded-lg overflow-x-auto">
								<pre className="text-xs">
									{`# Database
DATABASE_URL="postgresql://user:password@localhost:5432/reeooking"
DIRECT_URL="postgresql://user:password@localhost:5432/reeooking"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (Optional)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."`}
								</pre>
							</div>
						</TabsContent>

						<TabsContent value="step4" className="space-y-4 mt-4">
							<h4 className="font-semibold text-lg">Set Up Database</h4>
							<div className="space-y-3">
								<div>
									<p className="text-sm font-medium mb-2">1. Create PostgreSQL Database</p>
									<div className="bg-muted p-4 rounded-lg">
										<code className="text-sm">createdb reebooking</code>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium mb-2">2. Run Database Migrations</p>
									<div className="bg-muted p-4 rounded-lg">
										<code className="text-sm">
											npx prisma migrate dev
											<br />
											npx prisma generate
										</code>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="step5" className="space-y-4 mt-4">
							<h4 className="font-semibold text-lg">Run the Development Server</h4>
							<div className="bg-muted p-4 rounded-lg">
								<code className="text-sm">npm run dev</code>
							</div>
							<p className="text-sm text-muted-foreground">
								Open <a href="http://localhost:3000" className="text-primary underline">http://localhost:3000</a> in your browser to see the application.
							</p>
						</TabsContent>
					</Tabs>

					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Note</AlertTitle>
						<AlertDescription>
							After setting up the database, you'll need to create an admin account. See the Quick Start section for details.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</section>
	)
}

