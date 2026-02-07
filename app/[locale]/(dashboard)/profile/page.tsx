import LayoutAdmin from "@/components/layout/landing"
import { ProfileForm } from "@/components/profile/ProfileForm"
import currentUserServer from "@/lib/currentUserServer"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"

export default async function ProfilePage() {
	const t = await getTranslations("Profile")
	// Fetch current user from server
	const currentUser = await currentUserServer()

	// Redirect if not logged in
	if (!currentUser) redirect("/signin")

	return (
		<LayoutAdmin>
			<div className="min-h-screen bg-background">
				<div className="container mx-auto py-8 px-4">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>
						<ProfileForm />
					</div>
				</div>
			</div>
		</LayoutAdmin>
	)
}
