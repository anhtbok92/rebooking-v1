"use client"

import { Button } from "@/components/ui/button"
import { Shield, Lock, Users, User } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface FormData {
	email: string
	password: string
}

const testCredentials = [
	{
		role: "Super Admin",
		email: "super@demo.com",
		password: "123456",
		icon: Shield,
		color: "text-purple-600",
		bgColor: "bg-purple-50 hover:bg-purple-100",
		borderColor: "border-purple-200",
	},
	{
		role: "Admin",
		email: "admin@demo.com",
		password: "123456",
		icon: Lock,
		color: "text-blue-600",
		bgColor: "bg-blue-50 hover:bg-blue-100",
		borderColor: "border-blue-200",
	},
	{
		role: "Staff",
		email: "staff@demo.com",
		password: "123456",
		icon: Users,
		color: "text-green-600",
		bgColor: "bg-green-50 hover:bg-green-100",
		borderColor: "border-green-200",
	},
	{
		role: "Client",
		email: "client@demo.com",
		password: "123456",
		icon: User,
		color: "text-orange-600",
		bgColor: "bg-orange-50 hover:bg-orange-100",
		borderColor: "border-orange-200",
	},
]

export function QuickLoginButtons() {
	const { setValue } = useFormContext<FormData>()

	const handleQuickLogin = (email: string, password: string) => {
		setValue("email", email, { shouldValidate: true })
		setValue("password", password, { shouldValidate: true })
	}

	return (
		<div className="space-y-3 mt-5">
			<div className="text-center">
				<p className="text-sm font-medium text-muted-foreground mb-3">Quick Login (Demo)</p>
			</div>
			<div className="grid grid-cols-2 gap-2">
				{testCredentials.map((cred) => {
					const Icon = cred.icon
					return (
						<Button
							key={cred.role}
							type="button"
							variant="outline"
							onClick={() => handleQuickLogin(cred.email, cred.password)}
							className={`${cred.bgColor} ${cred.borderColor} border-2 h-auto py-2.5 flex flex-col items-center gap-1`}
						>
							<Icon className={`w-4 h-4 ${cred.color}`} />
							<span className="text-xs font-medium">{cred.role}</span>
						</Button>
					)
				})}
			</div>
		</div>
	)
}

