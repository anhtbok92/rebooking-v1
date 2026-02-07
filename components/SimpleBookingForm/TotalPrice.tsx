interface TotalPriceProps {
	selectedServices: Array<{ name: string; price: number }>
	totalPrice: number
}

export function TotalPrice({ selectedServices, totalPrice }: TotalPriceProps) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h2 className="text-xl font-bold text-card-foreground mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
				Price
			</h2>
			<div className="space-y-3">
				{selectedServices.length > 0 ? (
					<>
						{selectedServices.map((service, idx) => (
							<div key={idx} className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
									{service.name}
								</span>
								<span className="font-semibold text-foreground">${service.price.toLocaleString()}</span>
							</div>
						))}
						<div className="border-t border-border pt-3 flex items-center justify-between">
							<span className="font-semibold text-card-foreground">Total:</span>
							<span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
								${totalPrice.toLocaleString()}
							</span>
						</div>
					</>
				) : (
					<p className="text-muted-foreground text-center py-4">Select services to see pricing</p>
				)}
			</div>
		</div>
	)
}
