"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GlobalSearch } from "@/components/ui/global-search"
import { LogIn, BookOpen, Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { Link } from "@/i18n/routing"
import type { Session } from "next-auth"

interface HeaderClientProps {
	session: Session | null
}

export function HeaderClient({ session }: HeaderClientProps) {
	const t = useTranslations("Common")
	const [menuOpen, setMenuOpen] = useState(false)
	return (
		<>
			<header className="bg-card sticky top-0 z-50 px-4 border-b">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-2">
							<Logo />
						</div>
						{/* Desktop menu */}
						<div className="hidden md:flex items-center gap-3">
							<GlobalSearch />
							<ThemeToggle />
							<LanguageSwitcher />
							<Link href="/docs">
								<Button variant="ghost" className="gap-2">
									<BookOpen className="w-4 h-4" />
									{t("docs")}
								</Button>
							</Link>
							{session ? (
								<Link
									href={
										session.user && (session.user as any).role === "ADMIN"
											? "/admin"
											: "/dashboard"
									}
								>
									<Button variant="outline" className="gap-2">
										<LogIn className="w-4 h-4" />
										{t("dashboard")}
									</Button>
								</Link>
							) : (
								<>
									<Link href="/signin">
										<Button className="gap-2">
											<LogIn className="w-4 h-4" />
											{t("signIn")}
										</Button>
									</Link>
									<Link href="/signup">
										<Button className="gap-2">{t("signUp")}</Button>
									</Link>
								</>
							)}
						</div>

						{/* Mobile menu toggle */}
						<div className="flex md:hidden items-center gap-2">
							<ThemeToggle />
							<LanguageSwitcher />
							<Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
								<Menu className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile Menu - Slide Over */}
				{menuOpen && (
					<div className="md:hidden fixed inset-0 z-50 bg-black/60 flex">
						<div className="relative bg-card w-4/5 max-w-xs h-full shadow-lg flex flex-col px-6 py-7">
							<button
								className="absolute right-4 top-4 z-10"
								onClick={() => setMenuOpen(false)}
								aria-label="Close menu"
							>
								<X className="w-6 h-6 text-muted-foreground" />
							</button>
							<div className="mb-8">
								<Logo />
							</div>
							<GlobalSearch />
							<Link href="/docs" onClick={() => setMenuOpen(false)}>
								<Button variant="ghost" className="gap-2 w-full justify-start mb-2">
									<BookOpen className="w-4 h-4" />
									{t("docs")}
								</Button>
							</Link>
							{session ? (
								<Link
									href={
										session.user && (session.user as any).role === "ADMIN"
											? "/admin"
											: "/dashboard"
									}
									onClick={() => setMenuOpen(false)}
								>
									<Button variant="outline" className="gap-2 w-full justify-start">
										<LogIn className="w-4 h-4" />
										{t("dashboard")}
									</Button>
								</Link>
							) : (
								<>
									<Link href="/signin" onClick={() => setMenuOpen(false)}>
										<Button className="gap-2 w-full justify-start mb-2" variant="outline">
											<LogIn className="w-4 h-4" />
											{t("signIn")}
										</Button>
									</Link>
									<Link href="/signup" onClick={() => setMenuOpen(false)}>
										<Button className="gap-2 w-full justify-start" variant="default">
											{t("signUp")}
										</Button>
									</Link>
								</>
							)}
							<div className="mt-auto mb-2">
								<span className="block text-xs text-muted-foreground mt-8">
									&copy; {new Date().getFullYear()} All Rights Reserved
								</span>
							</div>
						</div>
						<div className="flex-grow" onClick={() => setMenuOpen(false)} aria-hidden="true" />
					</div>
				)}
			</header>
		</>
	)
}

