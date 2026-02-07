import Header from './header'

export default function LayoutLanding({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-background">
				{children}
			</main>
		</>
	)
}
