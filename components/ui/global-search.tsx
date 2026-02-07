"use client"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, Calendar, User, Package, Loader2, X, Ticket, Gift } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface SearchResult {
	id: string
	type: "booking" | "service" | "user" | "discount" | "referral"
	title: string
	subtitle: string
	description?: string
	status?: string
	role?: string
	image?: string | null
	active?: boolean
	referralCode?: string
	url: string
}

interface SearchResponse {
	bookings: SearchResult[]
	services: SearchResult[]
	users: SearchResult[]
	discountCodes?: SearchResult[]
	referralCodes?: SearchResult[]
}

export function GlobalSearch() {
	const t = useTranslations("Search")
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchResponse>({ bookings: [], services: [], users: [], discountCodes: [], referralCodes: [] })
	const [isLoading, setIsLoading] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()
	const { data: session } = useSession()

	// Keyboard shortcuts
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			// Cmd/Ctrl + K to open search
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				setIsOpen(true)
				setTimeout(() => inputRef.current?.focus(), 100)
			}

			// Escape to close
			if (event.key === "Escape" && isOpen) {
				setIsOpen(false)
				setQuery("")
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen])

	// Search debounce
	useEffect(() => {
		if (!query || query.length < 2) {
			setResults({ bookings: [], services: [], users: [], discountCodes: [], referralCodes: [] })
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		const timeoutId = setTimeout(async () => {
			try {
				const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
				if (response.ok) {
					const data = await response.json()
					setResults(data)
				}
			} catch (error) {
				console.error("Search error:", error)
			} finally {
				setIsLoading(false)
			}
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [query])

	// Get all results as flat array
	const allResults = [
		...results.bookings,
		...results.services,
		...results.users,
		...(results.discountCodes || []),
		...(results.referralCodes || []),
	]

	// Handle result click
	const handleResultClick = (result: SearchResult) => {
		router.push(result.url)
		setIsOpen(false)
		setQuery("")
	}

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault()
			setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setSelectedIndex((prev) => Math.max(prev - 1, 0))
		} else if (e.key === "Enter" && allResults[selectedIndex]) {
			e.preventDefault()
			handleResultClick(allResults[selectedIndex])
		}
	}

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "booking":
				return <Calendar className="w-4 h-4" />
			case "service":
				return <Package className="w-4 h-4" />
			case "user":
				return <User className="w-4 h-4" />
			case "discount":
				return <Ticket className="w-4 h-4" />
			case "referral":
				return <Gift className="w-4 h-4" />
			default:
				return <Search className="w-4 h-4" />
		}
	}

	const getTypeLabel = (type: string) => {
		return t(`types.${type}` as any) || t("types.result")
	}

	const getStatusBadge = (status?: string) => {
		if (!status) return null
		const statusColors: Record<string, string> = {
			PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
			CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
			COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
			CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
		}

		// Map status to translation key if needed, or use as is
		return (
			<Badge variant="outline" className={cn("text-xs", statusColors[status] || "")}>
				{status}
			</Badge>
		)
	}

	return (
		<>
			{/* Search Trigger */}
			<button
				onClick={() => {
					setIsOpen(true)
					setTimeout(() => inputRef.current?.focus(), 100)
				}}
				className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background transition-colors text-sm text-muted-foreground hover:text-foreground"
			>
				<Search className="w-4 h-4" />
				<span className="hidden md:inline">{t("trigger")}</span>
				<kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>
			</button>

			<Dialog open={isOpen} onOpenChange={open => {
				setIsOpen(open)
				if (!open) setQuery("")
			}}>
				<DialogContent
					className="p-0 border-0 w-full max-w-2xl shadow-xl rounded-lg bg-card overflow-hidden"
					onOpenAutoFocus={e => {
						// Prevent focusing DialogContent for autofocus, use input instead
						e.preventDefault()
						setTimeout(() => inputRef.current?.focus(), 50)
					}}
				>
					{/* Search Input */}
					<div className="flex items-center gap-2 p-4 border-b border-border">
						<Search className="w-5 h-5 text-muted-foreground" />
						<Input
							ref={inputRef}
							type="text"
							placeholder={t("placeholder")}
							value={query}
							onChange={(e) => {
								setQuery(e.target.value)
								setSelectedIndex(0)
							}}
							onKeyDown={handleKeyDown}
							className="border-0 focus-visible:ring-0 text-base h-auto py-2"
							autoFocus
						/>
						{query && (
							<button
								onClick={() => {
									setQuery("")
									inputRef.current?.focus()
								}}
								className="p-1 rounded"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>

					{/* Results */}
					<ScrollArea className="max-h-[60vh]">
						{isLoading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
							</div>
						) : query.length < 2 ? (
							<div className="py-12 text-center text-sm text-muted-foreground">
								{t("empty")}
							</div>
						) : allResults.length === 0 ? (
							<div className="py-12 text-center text-sm text-muted-foreground">
								{t("noResults", { query })}
							</div>
						) : (
							<div className="p-2">
								{/* Discount Codes */}
								{results.discountCodes && results.discountCodes.length > 0 && (
									<div className="mb-4">
										<div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
											{t("sections.discountCodes")} ({results.discountCodes.length})
										</div>
										{results.discountCodes.map((result, index) => {
											const offset = 0
											return (
												<button
													key={result.id}
													onClick={() => handleResultClick(result)}
													className={cn(
														"w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left",
														selectedIndex === offset + index && "bg-primary",
													)}
												>
													<div className="mt-0.5 text-muted-foreground">{getTypeIcon(result.type)}</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<p className="font-medium truncate">{result.title}</p>
															{result.active === false && (
																<Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-900">
																	{t("inactive")}
																</Badge>
															)}
														</div>
														<p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
													</div>
													<Badge variant="outline" className="text-xs shrink-0">
														{getTypeLabel(result.type)}
													</Badge>
												</button>
											)
										})}
									</div>
								)}

								{/* Referral Codes */}
								{results.referralCodes && results.referralCodes.length > 0 && (
									<div className="mb-4">
										<div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
											{t("sections.referralCodes")} ({results.referralCodes.length})
										</div>
										{results.referralCodes.map((result, index) => {
											const offset = (results.discountCodes?.length || 0)
											return (
												<button
													key={result.id}
													onClick={() => handleResultClick(result)}
													className={cn(
														"w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left",
														selectedIndex === offset + index && "bg-primary",
													)}
												>
													<div className="mt-0.5 text-muted-foreground">{getTypeIcon(result.type)}</div>
													<div className="flex-1 min-w-0">
														<p className="font-medium truncate">{result.title}</p>
														<p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
													</div>
													<Badge variant="outline" className="text-xs shrink-0">
														{getTypeLabel(result.type)}
													</Badge>
												</button>
											)
										})}
									</div>
								)}

								{/* Bookings */}
								{results.bookings.length > 0 && (
									<div className="mb-4">
										<div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
											{t("sections.bookings")} ({results.bookings.length})
										</div>
										{results.bookings.map((result, index) => (
											<button
												key={result.id}
												onClick={() => handleResultClick(result)}
												className={cn(
													"w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left",
													selectedIndex === index && "bg-primary",
												)}
											>
												<div className="mt-0.5 text-muted-foreground">{getTypeIcon(result.type)}</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<p className="font-medium truncate">{result.title}</p>
														{getStatusBadge(result.status)}
													</div>
													<p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
												</div>
												<Badge variant="outline" className="text-xs shrink-0">
													{getTypeLabel(result.type)}
												</Badge>
											</button>
										))}
									</div>
								)}

								{/* Services */}
								{results.services.length > 0 && (
									<div className="mb-4">
										<div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
											{t("sections.services")} ({results.services.length})
										</div>
										{results.services.map((result, index) => {
											const offset = (results.discountCodes?.length || 0) + (results.referralCodes?.length || 0) + results.bookings.length
											return (
												<button
													key={result.id}
													onClick={() => handleResultClick(result)}
													className={cn(
														"w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left",
														selectedIndex === offset + index && "bg-primary",
													)}
												>
													<div className="mt-0.5 text-muted-foreground">{getTypeIcon(result.type)}</div>
													<div className="flex-1 min-w-0">
														<p className="font-medium truncate">{result.title}</p>
														<p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
													</div>
													<Badge variant="outline" className="text-xs shrink-0">
														{getTypeLabel(result.type)}
													</Badge>
												</button>
											)
										})}
									</div>
								)}

								{/* Users */}
								{results.users.length > 0 && (
									<div>
										<div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
											{t("sections.users")} ({results.users.length})
										</div>
										{results.users.map((result, index) => {
											const offset = (results.discountCodes?.length || 0) + (results.referralCodes?.length || 0) + results.bookings.length + results.services.length
											return (
												<button
													key={result.id}
													onClick={() => handleResultClick(result)}
													className={cn(
														"w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left",
														selectedIndex === offset + index && "bg-primary",
													)}
												>
													<div className="mt-0.5 text-muted-foreground">{getTypeIcon(result.type)}</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<p className="font-medium truncate">{result.title}</p>
															{result.role && (
																<Badge variant="outline" className="text-xs">
																	{result.role}
																</Badge>
															)}
														</div>
														<p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
													</div>
													<Badge variant="outline" className="text-xs shrink-0">
														{getTypeLabel(result.type)}
													</Badge>
												</button>
											)
										})}
									</div>
								)}
							</div>
						)}
					</ScrollArea>

					{/* Footer */}
					{allResults.length > 0 && (
						<div className="px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
							<span>{t("navigate")}</span>
							<span>{t("resultsCount", { count: allResults.length })}</span>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

