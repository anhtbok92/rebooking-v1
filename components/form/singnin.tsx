"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { yupResolver } from "@hookform/resolvers/yup"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as yup from "yup"
import { QuickLoginButtons } from "./QuickLoginButtons"

interface FormData {
	email: string
	password: string
}

const schema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
})

export default function SigninForm() {
	const methods = useForm<FormData>({ resolver: yupResolver(schema) })
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods

	const onSubmit = async (data: FormData) => {
		try {
			const result = await signIn("credentials", { ...data, redirect: false })
			if (result?.error) return toast.error("Invalid email or password")
			toast.success("Signed in successfully!")
			// Wait for session cookie to be set, then redirect with full page reload
			// This ensures the cookie is available to middleware on Vercel
			// Increased delay for Vercel's serverless environment
			setTimeout(() => {
				window.location.href = "/dashboard"
			}, 500)
		} catch {
			toast.error("Something went wrong")
		}
	}

	const handleGoogleSignIn = async () => {
		try {
			await signIn("google", { callbackUrl: "/dashboard" })
		} catch (error) {
			toast.error("Failed to sign in with Google")
		}
	}

	return (
		<>
		<FormProvider {...methods}>
			<Button
				type="button"
				variant="outline"
				onClick={handleGoogleSignIn}
				className="w-full mb-4 flex items-center justify-center gap-2 bg-transparent hover:bg-primary"
			>
				<svg className="w-5 h-5" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				Sign in with Google
			</Button>

			<div className="relative mb-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-muted" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
				</div>
			</div>

			<div className="relative my-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-muted" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{[
					{ id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
					{ id: "password", label: "Password", type: "password", placeholder: "••••••••" },
				].map(({ id, label, type, placeholder }) => (
					<div key={id} className="space-y-2">
						<Label htmlFor={id}>{label}</Label>
						<Input id={id} type={type} placeholder={placeholder} {...register(id as keyof FormData)} />
						{errors[id as keyof FormData] && (
							<p className="text-sm text-destructive">{errors[id as keyof FormData]?.message}</p>
						)}
					</div>
				))}
				<div className="flex items-center justify-between">
					<Link
						href="/auth/forgot-password"
						className="text-sm text-muted-foreground hover:text-primary"
					>
						Forgot password?
					</Link>
				</div>
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Signing in..." : "Sign In"}
				</Button>
			</form>

			<QuickLoginButtons />
		</FormProvider>
		</>
	)
}
