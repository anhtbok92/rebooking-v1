'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBookingForm } from '@/components/SimpleBookingForm/useBookingForm'
import { ServiceSelection } from '@/components/SimpleBookingForm/ServiceSelection'
import { CalendarCard } from '@/components/SimpleBookingForm/CalendarCard'
import { TimeSelection } from '@/components/SimpleBookingForm/TimeSelection'
import { PhotoUpload } from '@/components/SimpleBookingForm/PhotoUpload'
import { CartSummary } from '@/components/SimpleBookingForm/CartSummary'
import { useCart } from '@/hooks/use-redux-cart'
import { toast } from 'sonner'

interface MobileBookingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialServiceId?: string
}

export function MobileBooking({ open, onOpenChange, initialServiceId }: MobileBookingProps) {
  const [step, setStep] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const form = useBookingForm(initialServiceId)
  const {
    services,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    photos,
    setPhotos,
    currentMonth,
    currentYear,
    handlePreviousMonth,
    handleNextMonth,
    calendarDays,
    weekDays,
    timeSlots,
    bookingCounts,
    totalPrice,
    selectedServiceData,
    isLoadingTimeSlots,
    isLoadingServices,
  } = form

  const { addToCart, cartCount } = useCart()
  const [prevCartCount, setPrevCartCount] = useState<number | null>(null)
  const [isInit, setIsInit] = useState(true)

  // Initialize
  useEffect(() => {
    if (isInit) {
      setPrevCartCount(cartCount)
      setIsInit(false)
    }
  }, [cartCount, isInit])

  // Open cart when item added
  useEffect(() => {
    if (!isInit && prevCartCount !== null && cartCount > prevCartCount && cartCount > 0) {
      setIsCartOpen(true)
    }
    setPrevCartCount(cartCount)
  }, [cartCount, isInit, prevCartCount])

  // Close cart when empty
  useEffect(() => {
    if (cartCount === 0) setIsCartOpen(false)
  }, [cartCount])

  // Auto add to cart when all selected
  useEffect(() => {
    if (selectedService && selectedDate && selectedTime) {
      addToCart({
        id: `${selectedService}-${selectedDate}-${selectedTime}-${Date.now()}`,
        serviceId: selectedService,
        serviceName: selectedServiceData?.name || '',
        price: totalPrice,
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
        time: selectedTime,
        photos,
      })
      toast.success('Đã thêm vào giỏ hàng', {
        description: `${selectedServiceData?.name || ''} đã được thêm vào giỏ hàng`,
      })
      // Reset selections
      setSelectedService('')
      setSelectedDate(null)
      setSelectedTime('')
      setPhotos([])
      setStep(1)
    }
  }, [selectedService, selectedDate, selectedTime, selectedServiceData, totalPrice, currentYear, currentMonth, photos, addToCart, setSelectedService, setSelectedDate, setSelectedTime, setPhotos])

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setIsCartOpen(false)
    }
  }, [open])

  const allSlotsBooked = !!selectedDate && !!selectedService && timeSlots.every((t) => !t.available)

  const handleNext = () => {
    if (step === 1 && selectedService) setStep(2)
    else if (step === 2 && selectedDate) setStep(3)
    else if (step === 3 && selectedTime) setStep(4)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const canGoNext = () => {
    if (step === 1) return !!selectedService
    if (step === 2) return !!selectedDate && !allSlotsBooked
    if (step === 3) return !!selectedTime
    return false
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 border-0 w-full max-w-[430px] mx-auto shadow-xl rounded-3xl bg-white dark:bg-slate-900 overflow-hidden h-[90vh] flex flex-col">
          <DialogTitle className="sr-only">Đặt lịch hẹn</DialogTitle>
          <DialogDescription className="sr-only">
            Chọn dịch vụ, ngày và giờ để đặt lịch hẹn
          </DialogDescription>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-primary">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900">Đặt Lịch Hẹn</h2>
                <p className="text-xs text-slate-700">
                  Bước {step}/4: {step === 1 ? 'Chọn dịch vụ' : step === 2 ? 'Chọn ngày' : step === 3 ? 'Chọn giờ' : 'Tải ảnh (tùy chọn)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1 px-4 pt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {step === 1 && (
              <ServiceSelection
                services={services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                isLoading={isLoadingServices}
              />
            )}

            {step === 2 && (
              <CalendarCard
                currentMonth={currentMonth}
                currentYear={currentYear}
                handlePreviousMonth={handlePreviousMonth}
                handleNextMonth={handleNextMonth}
                calendarDays={calendarDays}
                weekDays={weekDays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                bookingCounts={bookingCounts}
                selectedService={selectedService}
                disabledDates={
                  selectedService
                    ? Object.keys(bookingCounts)
                        .filter((day) => bookingCounts[+day] >= 6)
                        .map(Number)
                    : []
                }
              />
            )}

            {step === 3 && (
              <div>
                <TimeSelection
                  timeSlots={timeSlots}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  isLoading={isLoadingTimeSlots}
                  disabled={!selectedService || !selectedDate}
                />
                {allSlotsBooked && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mt-4">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      Tất cả khung giờ đã được đặt. Vui lòng chọn ngày khác.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Tải lên ảnh liên quan (tùy chọn)
                </p>
                <PhotoUpload photos={photos} setPhotos={setPhotos} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold"
              >
                {step === 3 ? 'Tiếp tục' : 'Tiếp theo'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Photos are optional, just close and let auto-add handle it
                  onOpenChange(false)
                }}
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold"
              >
                Hoàn tất
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6 text-slate-900" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-[430px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Giỏ hàng ({cartCount})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
              <CartSummary onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
