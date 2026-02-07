"use client"


import SingninForm from '@/components/form/singnin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function SignInPage() {

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<Logo variant="default" href={null} />
					</div>
					<CardTitle className="text-3xl font-bold">
						Welcome Back
					</CardTitle>
					<CardDescription>Sign in to your Reebooking account</CardDescription>
				</CardHeader>
				<CardContent>


					<SingninForm />
					<div className="mt-4 text-center text-sm">
						<span className="text-muted-foreground">Don't have an account? </span>
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
