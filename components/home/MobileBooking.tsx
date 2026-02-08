'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBookingForm } from '@/components/SimpleBookingForm/useBookingForm'
import { MobileServiceSelection } from '@/components/home/MobileServiceSelection'
import { MobileDoctorSelection } from '@/components/home/MobileDoctorSelection'
import { CalendarCard } from '@/components/SimpleBookingForm/CalendarCard'
import { TimeSelection } from '@/components/SimpleBookingForm/TimeSelection'
import { useCart } from '@/hooks/use-redux-cart'
import { toast } from 'sonner'

interface MobileBookingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialServiceId?: string
  onNavigateToCart?: () => void
}

export function MobileBooking({ open, onOpenChange, initialServiceId, onNavigateToCart }: MobileBookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  
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

  const { addToCart } = useCart()

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedDoctor('')
    }
  }, [open])

  const allSlotsBooked = !!selectedDate && !!selectedService && timeSlots.every((t) => !t.available)

  const handleNext = () => {
    if (step === 1 && selectedService) setStep(2)
    else if (step === 2 && selectedDate) setStep(3)
    else if (step === 3 && selectedTime) setStep(4)
    else if (step === 4 && selectedDoctor) setStep(5)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const canGoNext = () => {
    if (step === 1) return !!selectedService
    if (step === 2) return !!selectedDate && !allSlotsBooked
    if (step === 3) return !!selectedTime
    if (step === 4) return !!selectedDoctor
    return false
  }

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !selectedDoctor) {
      toast.error('Vui lòng hoàn tất tất cả các bước')
      return
    }

    // Add to cart
    addToCart({
      id: `${selectedService}-${selectedDate}-${selectedTime}-${selectedDoctor}-${Date.now()}`,
      serviceId: selectedService,
      serviceName: selectedServiceData?.name || '',
      price: totalPrice,
      date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
      time: selectedTime,
      photos,
      doctorId: selectedDoctor,
    })

    toast.success('Đã thêm vào giỏ hàng', {
      description: `${selectedServiceData?.name || ''} đã được thêm vào giỏ hàng`,
    })

    // Reset selections
    setSelectedService('')
    setSelectedDate(null)
    setSelectedTime('')
    setSelectedDoctor('')
    setPhotos([])
    setStep(1)

    // Close modal and navigate to cart
    onOpenChange(false)
    if (onNavigateToCart) {
      onNavigateToCart()
    }
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
                  Bước {step}/5: {
                    step === 1 ? 'Chọn dịch vụ' : 
                    step === 2 ? 'Chọn ngày' : 
                    step === 3 ? 'Chọn giờ' : 
                    step === 4 ? 'Chọn bác sĩ' : 
                    'Xác nhận'
                  }
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
            {[1, 2, 3, 4, 5].map((s) => (
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
              <MobileServiceSelection
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
                  Chọn bác sĩ cho lịch hẹn của bạn
                </p>
                <MobileDoctorSelection
                  selectedDoctor={selectedDoctor}
                  setSelectedDoctor={setSelectedDoctor}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Xác nhận thông tin
                </h3>
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary text-xl">medical_services</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Dịch vụ</p>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {selectedServiceData?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary text-xl">calendar_today</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ngày</p>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {selectedDate}/{currentMonth}/{currentYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary text-xl">schedule</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Giờ</p>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons-round text-primary text-xl">person</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Bác sĩ</p>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {selectedDoctor ? 'Đã chọn' : 'Chưa chọn'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tổng tiền</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">
                          {totalPrice.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-sm text-slate-500">đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold"
              >
                Tiếp theo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirmBooking}
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold"
              >
                Đặt lịch
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
