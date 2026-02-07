"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface FormData {
	name: string
	email: string
	phone: string
	password: string
}

const schema = yup.object({
	name: yup.string().required("Full name is required"),
	email: yup.string().email("Invalid email").required("Email is required"),
	phone: yup
		.string()
		.matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
		.required("Phone number is required"),
	password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
})

export default function SignupForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [loading, setLoading] = useState(false)
	const [referralCode, setReferralCode] = useState<string | null>(null)

	useEffect(() => {
		const ref = searchParams.get("ref")
		if (ref) {
			setReferralCode(ref.toUpperCase())
		}
	}, [searchParams])

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: yupResolver(schema),
	})

	const onSubmit = async (data: FormData) => {
		setLoading(true)
		try {
			const res = await fetch("/api/v1/user/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					...data, 
					role: "CLIENT",
					referralCode: referralCode || undefined,
				}),
			})
			const result = await res.json()

			if (!res.ok) throw new Error(result.error || "Failed to create account")

			toast.success("Account created successfully! Redirecting...")
			reset()
			setTimeout(() => router.push("/signin"), 1200)
		} catch (err: any) {
			toast.error(err.message || "Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{referralCode && (
				<div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-primary">Referral Code Applied</p>
							<p className="text-xs text-muted-foreground mt-1">
								You'll be signed up with referral code: <code className="font-mono font-bold">{referralCode}</code>
							</p>
						</div>
						<Badge variant="secondary" className="font-mono">{referralCode}</Badge>
					</div>
				</div>
			)}
			{(["name", "email", "phone", "password"] as const).map((field) => (
				<div key={field} className="space-y-2">
					<Label htmlFor={field}>
						{field === "name"
							? "Full Name"
							: field === "email"
								? "Email"
								: field === "phone"
									? "Phone Number"
									: "Password"}
					</Label>
					<Input
						id={field}
						type={
							field === "password"
								? "password"
								: field === "email"
									? "email"
									: "text"
						}
						placeholder={
							field === "name"
								? "John Doe"
								: field === "email"
									? "john@example.com"
									: field === "phone"
										? "+1 (555) 000-0000"
										: "••••••••"
						}
						{...register(field)}
					/>
					{errors[field] && (
						<p className="text-sm text-destructive">{errors[field]?.message}</p>
					)}
				</div>
			))}

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Creating account..." : "Sign Up"}
			</Button>
		</form>
	)
}
