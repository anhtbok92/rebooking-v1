import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { HeaderClient } from "./header-client"

export default async function Header() {
	let session = null
	try {
		session = await getServerSession(authOptions)
	} catch (error) {
		// Silently fail - auth errors are handled by NextAuth
	}

	return <HeaderClient session={session} />
}
