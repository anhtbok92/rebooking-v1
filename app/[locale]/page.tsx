// import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
// import { SimpleFooter } from "@/components/landing/SimpleFooter"
import LayoutAdmin from "@/components/layout/landing"
import { SimpleBookingForm } from '@/components/SimpleBookingForm'

export default function Home() {
	return (
		<LayoutAdmin>
			<div className="min-h-screen bg-background">
				<SimpleBookingForm />
				{/* <HowItWorksSection /> */}
				{/* <SimpleFooter /> */}
			</div>
		</LayoutAdmin>
	)
}
