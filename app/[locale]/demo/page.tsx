import { BookingFormSection } from "@/components/landing/BookingFormSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { Footer } from "@/components/landing/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { HowToTestSection } from "@/components/landing/HowToTestSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { TestCredentialsSection } from "@/components/landing/TestCredentialsSection"
import { WhyChooseSection } from "@/components/landing/WhyChooseSection"
import LayoutAdmin from "@/components/layout/landing"

export default function DemoLandingPage() {
	return (
		<LayoutAdmin>
			<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
				<HeroSection />
				<TestCredentialsSection />
				<HowItWorksSection />
				<BookingFormSection />
				<WhyChooseSection />
				<FeaturesSection />
				<StatsSection />
				<HowToTestSection />
				<Footer />
			</div>
		</LayoutAdmin>
	)
}
