
import SignupForm from '@/components/form/signup'
import { Logo } from "@/components/ui/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

function SignupFormWrapper() {
	return <SignupForm />
}

export default function SignUpPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<Logo variant="default" href={null} />
					</div>
					<CardTitle className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
						Create Account
					</CardTitle>
					<CardDescription>Sign up for your Reebooking account</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div className="text-center py-4">Loading...</div>}>
						<SignupFormWrapper />
					</Suspense>
					<div className="mt-4 text-center text-sm">
						<span className="text-muted-foreground">Already have an account? </span>
						<Link href="/signin" className="text-primary hover:underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
