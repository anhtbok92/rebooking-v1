import { AdminGuides } from "@/components/docs/AdminGuides"
import { AdvancedTopics } from "@/components/docs/AdvancedTopics"
import { APIDocumentation } from "@/components/docs/APIDocumentation"
import { Checklist } from "@/components/docs/Checklist"
import { ComponentDocs } from "@/components/docs/ComponentDocs"
import { Configuration } from "@/components/docs/Configuration"
import { DatabaseSchema } from "@/components/docs/DatabaseSchema"
import { DocsSearch } from "@/components/docs/DocsSearch"
import { Features } from "@/components/docs/Features"
import { GettingStarted } from "@/components/docs/GettingStarted"
import { Installation } from "@/components/docs/Installation"
import { Introduction } from "@/components/docs/Introduction"
import { QuickStart } from "@/components/docs/QuickStart"
import { TableOfContents } from "@/components/docs/TableOfContents"
import { Troubleshooting } from "@/components/docs/Troubleshooting"
import { UserGuides } from "@/components/docs/UserGuides"
import LayoutLanding from "@/components/layout/landing"

const sections = [
	{ id: "introduction", title: "Introduction" },
	{ id: "getting-started", title: "Getting Started" },
	{ id: "installation", title: "Installation Guide" },
	{ id: "configuration", title: "Configuration" },
	{ id: "features", title: "Features Overview" },
	{ id: "quick-start", title: "Quick Start" },
	{ id: "user-guides", title: "User Guides" },
	{ id: "admin-guides", title: "Admin Guides" },
	{ id: "api-documentation", title: "API Documentation" },
	{ id: "component-documentation", title: "Component Documentation" },
	{ id: "database-schema", title: "Database Schema" },
	{ id: "troubleshooting", title: "Troubleshooting" },
	{ id: "advanced-topics", title: "Advanced Topics" },
	{ id: "checklist", title: "Checklist" },
]

export default function DocsPage() {
	return (
		<LayoutLanding>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-3 space-y-8">
						<div className="mb-8">
							<h1 className="text-4xl font-bold mb-2">Documentation</h1>
							<p className="text-muted-foreground text-lg">
								Complete guide to setting up and using the Reebooking system
							</p>
						</div>

						<DocsSearch />

						<Introduction />
						<GettingStarted />
						<Installation />
						<Configuration />
						<Features />
						<QuickStart />
						<UserGuides />
						<AdminGuides />
						<APIDocumentation />
						<ComponentDocs />
						<DatabaseSchema />
						<Troubleshooting />
						<AdvancedTopics />
						<Checklist />
					</div>

					{/* Sidebar - Table of Contents */}
					<div className="lg:col-span-1">
						<TableOfContents sections={sections} />
					</div>
				</div>
			</div>
		</LayoutLanding>
	)
}

