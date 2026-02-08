"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BookingFiltersProps {
	sortBy: "date-desc" | "date-asc" | "price-desc" | "price-asc"
	onSortChange: (value: "date-desc" | "date-asc" | "price-desc" | "price-asc") => void
	onReset: () => void
}

import { useTranslations } from "next-intl"

export function BookingFilters({ sortBy, onSortChange, onReset }: BookingFiltersProps) {
	const t = useTranslations("Admin.bookings.filters")
	return (
		<div className="flex gap-2 flex-wrap">
			<Select value={sortBy} onValueChange={onSortChange}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder={t("sortBy")} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="date-desc">{t("sortDateDesc")}</SelectItem>
					<SelectItem value="date-asc">{t("sortDateAsc")}</SelectItem>
					<SelectItem value="price-desc">{t("sortPriceDesc")}</SelectItem>
					<SelectItem value="price-asc">{t("sortPriceAsc")}</SelectItem>
				</SelectContent>
			</Select>
			<Button variant="outline" size="sm" onClick={onReset}>
				{t("reset")}
			</Button>
		</div>
	)
}

