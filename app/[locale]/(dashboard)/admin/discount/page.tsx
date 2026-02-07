import LayoutAdmin from '@/components/layout/admin'
import { DiscountManagement } from '@/components/admin/DiscountManagement'

export default function DiscountCodesPage() {
	return (
		<LayoutAdmin>
			<div className="p-6 max-w-7xl mx-auto">
				<DiscountManagement />
			</div>
		</LayoutAdmin>
	)
}