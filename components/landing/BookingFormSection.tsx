"use client"

import { SimpleBookingForm } from "@/components/SimpleBookingForm"

export function BookingFormSection() {
	return (
		<section id="booking" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background scroll-mt-20">
			<div className="max-w-7xl mx-auto">
				<SimpleBookingForm />
			</div>
		</section>
	)
}

