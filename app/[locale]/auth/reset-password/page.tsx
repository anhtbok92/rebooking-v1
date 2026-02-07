"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { yupResolver } from "@hookform/resolvers/yup"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as yup from "yup"
import Link from "next/link"

interface FormData {
	newPassword: string
	confirmPassword: string
}

const schema = yup.object({
	newPassword: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("newPassword")], "Passwords must match")
		.required("Please confirm your password"),
})

function ResetPasswordForm() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const token = searchParams.get("token")
	const email = searchParams.get("email")

	const methods = useForm<FormData>({ resolver: yupResolver(schema) })
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods

	const onSubmit = async (data: FormData) => {
		if (!token || !email) {
			toast.error("Invalid reset link")
			return
		}

		try {
			const response = await fetch("/api/v1/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token,
					email,
					newPassword: data.newPassword,
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || "Failed to reset password")
			}

			toast.success("Password reset successfully! You can now sign in.")
			setTimeout(() => {
				router.push("/signin")
			}, 2000)
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to reset password")
		}
	}

	if (!token || !email) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Invalid Reset Link</CardTitle>
						<CardDescription>The password reset link is invalid or has expired.</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/signin">
							<Button className="w-full">Back to Sign In</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>Enter your new password below</CardDescription>
				</CardHeader>
				<CardContent>
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="newPassword">New Password</Label>
								<Input
									id="newPassword"
									type="password"
									placeholder="••••••••"
									{...register("newPassword")}
								/>
								{errors.newPassword && (
									<p className="text-sm text-destructive">{errors.newPassword.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && (
									<p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Resetting..." : "Reset Password"}
							</Button>
						</form>
					</FormProvider>
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

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Loading...</p>
					</CardContent>
				</Card>
			</div>
		}>
			<ResetPasswordForm />
		</Suspense>
	)
}

