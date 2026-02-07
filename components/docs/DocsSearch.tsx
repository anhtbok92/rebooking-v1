"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, FileText, Code, Settings, Users, Calendar } from "lucide-react"
import { useState, useMemo } from "react"
import Link from "next/link"

interface DocSection {
	id: string
	title: string
	content: string
	keywords: string[]
	icon: any
	url: string
}

const docSections: DocSection[] = [
	{
		id: "introduction",
		title: "Introduction",
		content: "Learn about the Reebooking system, its features, and capabilities",
		keywords: ["introduction", "overview", "about", "what is", "getting started"],
		icon: BookOpen,
		url: "/docs#introduction",
	},
	{
		id: "features",
		title: "Features",
		content: "Customer features like booking, cart, payments, and admin features like user management",
		keywords: ["features", "booking", "cart", "payment", "admin", "dashboard", "user management"],
		icon: FileText,
		url: "/docs#features",
	},
	{
		id: "quick-start",
		title: "Quick Start",
		content: "Get up and running quickly with step-by-step instructions",
		keywords: ["quick start", "setup", "install", "begin", "start", "tutorial"],
		icon: Code,
		url: "/docs#quick-start",
	},
	{
		id: "installation",
		title: "Installation",
		content: "Detailed installation guide with prerequisites and configuration",
		keywords: ["installation", "setup", "configure", "prerequisites", "requirements", "database"],
		icon: Settings,
		url: "/docs#installation",
	},
	{
		id: "checklist",
		title: "Checklist",
		content: "Complete checklist for deployment and configuration",
		keywords: ["checklist", "deploy", "configuration", "setup", "verify", "test"],
		icon: Calendar,
		url: "/docs#checklist",
	},
]

export function DocsSearch() {
	const [query, setQuery] = useState("")

	const filteredSections = useMemo(() => {
		if (!query.trim()) return []

		const searchTerm = query.toLowerCase().trim()
		return docSections.filter((section) => {
			const matchesTitle = section.title.toLowerCase().includes(searchTerm)
			const matchesContent = section.content.toLowerCase().includes(searchTerm)
			const matchesKeywords = section.keywords.some((keyword) => keyword.includes(searchTerm))
			return matchesTitle || matchesContent || matchesKeywords
		})
	}, [query])

	return (
		<Card className="mb-8">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Search className="w-5 h-5" />
					Search Documentation
				</CardTitle>
				<CardDescription>Find what you're looking for quickly</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search documentation... (e.g., booking, installation, features)"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{query && (
					<div className="mt-4 space-y-2">
						{filteredSections.length > 0 ? (
							<>
								<p className="text-sm text-muted-foreground mb-2">
									Found {filteredSections.length} result{filteredSections.length !== 1 ? "s" : ""}
								</p>
								{filteredSections.map((section) => {
									const Icon = section.icon
									return (
										<Link
											key={section.id}
											href={section.url}
											className="block p-3 rounded-lg border border-border hover:bg-primary transition-colors"
										>
											<div className="flex items-start gap-3">
												<Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-sm">{section.title}</h4>
													<p className="text-xs text-muted-foreground mt-1">{section.content}</p>
												</div>
											</div>
										</Link>
									)
								})}
							</>
						) : (
							<div className="text-center py-8 text-sm text-muted-foreground">
								<Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
								<p>No results found for &quot;{query}&quot;</p>
								<p className="text-xs mt-1">Try different keywords or browse the sections below</p>
							</div>
						)}
					</div>
				)}

				{!query && (
					<div className="mt-4 pt-4 border-t">
						<p className="text-xs text-muted-foreground mb-2">Quick links:</p>
						<div className="flex flex-wrap gap-2">
							{docSections.map((section) => {
								const Icon = section.icon
								return (
									<Link
										key={section.id}
										href={section.url}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border hover:bg-primary transition-colors"
									>
										<Icon className="w-3 h-3" />
										{section.title}
									</Link>
								)
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

