'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-redux-cart'
import { formatBookingDateTime } from '@/lib/utils'
import { ShoppingCart, Trash2, ArrowRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { EditCartItemDialog } from '@/components/cart/EditCartItemDialog'
import { useRouter } from 'next/navigation'
import { Brush, Droplet, Footprints, Hand, Palette } from 'lucide-react'

// Helper function to get service icon
function getServiceIcon(serviceName: string) {
  const serviceNameLower = serviceName.toLowerCase()
  if (serviceNameLower.includes('manicure')) return Hand
  if (serviceNameLower.includes('pedicure')) return Footprints
  if (serviceNameLower.includes('refill')) return Brush
  if (serviceNameLower.includes('nail art') || serviceNameLower.includes('nail-art')) return Palette
  return Droplet
}

export default function CartPage({ onNavigateToHome }: { onNavigateToHome?: () => void }) {
  const { cart, removeFromCart, cartTotal, cartCount, updateCartItem, clearCart } = useCart()
  const router = useRouter()

  const handleRemoveItem = (itemId: string, serviceName: string) => {
    removeFromCart(itemId)
    toast.success('Đã xóa khỏi giỏ hàng', {
      description: `${serviceName} đã được xóa`,
    })
  }

  const handleClearAll = () => {
    toast('Xóa giỏ hàng', {
      description: 'Bạn có chắc muốn xóa tất cả?',
      action: {
        label: 'Xóa',
        onClick: () => {
          clearCart()
          toast.success('Đã xóa giỏ hàng')
        },
      },
      cancel: {
        label: 'Hủy',
        onClick: () => {},
      },
    })
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // Empty state
  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Giỏ Hàng Trống
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Thêm dịch vụ vào giỏ hàng để bắt đầu
          </p>
          <button
            onClick={onNavigateToHome}
            className="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm dịch vụ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-6">
      {/* Header */}
      <header className="bg-primary pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h1 className="text-white text-xl font-bold">Giỏ Hàng</h1>
            <p className="text-white/80 text-xs">
              {cartCount} {cartCount === 1 ? 'dịch vụ' : 'dịch vụ'}
            </p>
          </div>
          {cartCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </header>

      {/* Cart Items */}
      <section className="px-6 py-6 space-y-3">
        {cart.map((item) => {
          const ServiceIcon = getServiceIcon(item.serviceName)
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-4">
                {/* Service Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 p-2 rounded-xl bg-primary/10 text-primary">
                    <ServiceIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">
                      {item.serviceName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatBookingDateTime(item.date, item.time)}
                    </p>
                    {item.photos && item.photos.length > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        {item.photos.length} ảnh đính kèm
                      </p>
                    )}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-primary text-base">
                      {item.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs text-slate-500">đ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditCartItemDialog item={item} onUpdate={updateCartItem} />
                    <button
                      onClick={() => handleRemoveItem(item.id, item.serviceName)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* Summary Footer */}
      <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg">
        <div className="max-w-[430px] mx-auto space-y-3">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Tổng cộng</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {cartTotal.toLocaleString('vi-VN')}
              </span>
              <span className="text-sm text-slate-500">đ</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Thanh toán
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Continue Shopping */}
          <button
            onClick={onNavigateToHome}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  )
}
