import { Input } from "@/components/ui/input"
import { Phone, User } from "lucide-react"

interface UserInformationProps {
	userName: string
	setUserName: (name: string) => void
	phone: string
	setphone: (phone: string) => void
}

export function UserInformation({ userName, setUserName, phone, setphone }: UserInformationProps) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h2
				className="text-xl font-bold text-card-foreground mb-4"
				style={{ fontFamily: "var(--font-space-grotesk)" }}
			>
				Your Information
			</h2>
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<User className="w-5 h-5 text-primary" />
					<Input
						type="text"
						placeholder="Full Name"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className="flex-1"
					/>
				</div>
				<div className="flex items-center gap-3">
					<Phone className="w-5 h-5 text-primary" />
					<Input
						type="tel"
						placeholder="Phone Number (e.g., +260123456789)"
						value={phone}
						onChange={(e) => setphone(e.target.value)}
						className="flex-1"
					/>
				</div>
			</div>
		</div>
	)
}
