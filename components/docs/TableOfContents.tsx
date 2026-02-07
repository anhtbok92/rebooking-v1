"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
	sections: Array<{ id: string; title: string }>
}

export function TableOfContents({ sections }: TableOfContentsProps) {
	const [activeSection, setActiveSection] = useState<string>("")

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100

			for (const section of sections) {
				const element = document.getElementById(section.id)
				if (element) {
					const { offsetTop, offsetHeight } = element
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setActiveSection(section.id)
						break
					}
				}
			}
		}

		window.addEventListener("scroll", handleScroll)
		handleScroll()

		return () => window.removeEventListener("scroll", handleScroll)
	}, [sections])

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id)
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 80,
				behavior: "smooth",
			})
		}
	}

	return (
		<Card className="sticky top-20 p-4 hidden lg:block">
			<h3 className="font-semibold mb-4 text-sm uppercase tracking-wide">Table of Contents</h3>
			<ScrollArea className="h-[calc(100vh-8rem)]">
				<nav className="space-y-2">
					{sections.map((section) => (
						<button
							key={section.id}
							onClick={() => scrollToSection(section.id)}
							className={cn(
								"block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
								activeSection === section.id
									? "bg-primary/10 text-primary font-medium"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							{section.title}
						</button>
					))}
				</nav>
			</ScrollArea>
		</Card>
	)
}

