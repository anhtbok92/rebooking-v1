"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as yup from "yup"
import Link from "next/link"
import { useState } from "react"

interface FormData {
	email: string
}

const schema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
})

export default function ForgotPasswordPage() {
	const [isSubmitted, setIsSubmitted] = useState(false)
	const methods = useForm<FormData>({ resolver: yupResolver(schema) })
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods

	const onSubmit = async (data: FormData) => {
		try {
			const response = await fetch("/api/v1/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: data.email }),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || "Failed to send reset email")
			}

			toast.success(result.message || "If an account exists, a reset link has been sent to your email.")
			setIsSubmitted(true)
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to send reset email")
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
					<CardDescription>
						{isSubmitted
							? "Check your email for a password reset link"
							: "Enter your email address and we'll send you a link to reset your password"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isSubmitted ? (
						<div className="space-y-4">
							<div className="p-4 bg-muted rounded-lg">
								<p className="text-sm text-muted-foreground">
									If an account with that email exists, we've sent a password reset link. Please check
									your inbox and follow the instructions.
								</p>
							</div>
							<Link href="/signin">
								<Button className="w-full">Back to Sign In</Button>
							</Link>
						</div>
					) : (
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										{...register("email")}
									/>
									{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
								</div>

								<Button type="submit" className="w-full" disabled={isSubmitting}>
									{isSubmitting ? "Sending..." : "Send Reset Link"}
								</Button>
							</form>
						</FormProvider>
					)}
					<div className="mt-4 text-center">
						<Link href="/signin" className="text-sm text-muted-foreground hover:text-primary">
							Back to Sign In
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

