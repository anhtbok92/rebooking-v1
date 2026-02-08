'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useUserBookings } from '@/lib/swr'
import { Calendar, ChevronRight, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id
  const { data: bookingsData, isLoading } = useUserBookings(userId)
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  
  // Filter bookings
  const now = new Date()
  // Set to start of today to include bookings later today
  now.setHours(0, 0, 0, 0)
  
  const upcomingBookings = bookingsData?.bookings.filter(booking => {
    const bookingDate = new Date(booking.date)
    bookingDate.setHours(0, 0, 0, 0)
    return bookingDate >= now && (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []
  
  const completedBookings = bookingsData?.bookings.filter(booking => {
    return booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []
  
  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : completedBookings
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  }
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Lịch Hẹn</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Vui lòng đăng nhập để xem lịch hẹn của bạn
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-primary text-slate-900 pt-12 pb-6 px-4 rounded-b-[24px] sticky top-0 z-50">
        <h1 className="text-xl font-bold">Lịch Hẹn</h1>
      </header>
      
      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sắp Tới
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Đã Khám
          </button>
        </div>
      </div>
      
      {/* Content */}
      <main className="mt-6 px-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {activeTab === 'upcoming' 
                ? 'Bạn chưa có lịch hẹn nào sắp tới' 
                : 'Chưa có lịch hẹn nào đã hoàn thành'}
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[3px] top-4 bottom-4 w-[2px] bg-gray-200 dark:bg-slate-700"></div>
            
            {displayBookings.map((booking, index) => {
              const isUpcoming = activeTab === 'upcoming'
              const borderColor = isUpcoming ? 'border-primary' : 'border-slate-300 dark:border-slate-600'
              const dotColor = isUpcoming ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
              const iconColor = isUpcoming ? 'text-primary' : 'text-slate-400'
              
              return (
                <div key={booking.id} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[27px] top-6 w-3 h-3 rounded-full ${dotColor} border-2 border-white dark:border-slate-900`}></div>
                  
                  {/* Booking card */}
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border-l-4 ${borderColor}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                          {booking.service.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {booking.userName}
                        </p>
                        {booking.status && (
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : booking.status === 'PENDING'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : booking.status === 'COMPLETED'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                             booking.status === 'PENDING' ? 'Chờ xác nhận' :
                             booking.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                          </span>
                        )}
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <span className={`material-icons-round text-[18px] ${iconColor}`}>calendar_month</span>
                          <span className="text-xs font-medium">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <span className={`material-icons-round text-[18px] ${iconColor}`}>schedule</span>
                          <span className="text-xs font-medium">{booking.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <span className={`material-icons-round text-[18px] ${iconColor}`}>payments</span>
                        <span className="text-xs font-medium">{formatPrice(booking.service.price)}</span>
                      </div>
                      {(booking as any).doctor && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <span className={`material-icons-round text-[18px] ${iconColor}`}>person</span>
                          <span className="text-xs font-medium">BS. {(booking as any).doctor.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {isUpcoming && (
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                          Đổi lịch
                        </button>
                        <button className="flex-1 py-2.5 rounded-xl bg-primary text-slate-900 text-xs font-bold">
                          Chi tiết
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
      {/* Floating button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 max-w-[430px] mx-auto">
        <button className="w-full bg-primary text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
          <Plus className="w-6 h-6" />
          Đặt lịch mới
        </button>
      </div>
    </div>
  )
}
