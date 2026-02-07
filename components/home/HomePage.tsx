'use client'

import { Bell, MapPin, Calendar, Stethoscope, Newspaper, FolderOpen, Wallet, ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { MobileSearch } from './MobileSearch'
import { MobileBooking } from './MobileBooking'
import { useServices, useUserBookings } from '@/lib/swr'
import { useState, useMemo } from 'react'

export default function HomePage({ 
  onNavigateToAppointments,
  onNavigateToDoctors
}: { 
  onNavigateToAppointments?: () => void
  onNavigateToDoctors?: () => void
}) {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  
  // Get user info
  const userName = session?.user?.name || 'Khách hàng'
  const userImage = session?.user?.image
  const userId = (session?.user as any)?.id
  
  // Fetch services - limit to 4 for featured section
  const { data: servicesData, isLoading: isLoadingServices } = useServices({ limit: 4 })
  const services = servicesData?.services || []
  
  // Fetch user bookings
  const { data: bookingsData, isLoading: isLoadingBookings } = useUserBookings(userId)
  
  // Get upcoming bookings (future dates, confirmed or pending)
  const upcomingBookings = useMemo(() => {
    if (!bookingsData?.bookings) return []
    
    const now = new Date()
    return bookingsData.bookings
      .filter(booking => {
        const bookingDate = new Date(booking.date)
        return bookingDate >= now && (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 1) // Only show the next upcoming booking
  }, [bookingsData])
  
  const nextBooking = upcomingBookings[0]
  
  // Booking dialog state
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined)
  
  // Fake images for services (will be replaced later)
  const serviceImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_90PHSxS095lP6_7HlW9dFxxkujV-L90MtHrBnWEzNDByqkN75f60cxRlHD6GkEoe7MDQw_ANcKqzgpsWezm8IVuZZXJaJmndr1YvSTtlbnHKJum_PKbBfMJ3_XzVlKDEtOhsUGb1-nFtpcrRXCxcVsxGqBnoc2dRJCVJna0IjjNT-aNbpRCc4TDYS6M4P0wfKV5n5kql_bdw4wW8Om1d928VN0R3p46HGhQoqA1ELjm1s_usYJWQVGDXgKXtv72Zm0DOPjrItchp',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDCa6tHVpbxa2kV8ZRgeU9rXZHcfU3tCoc7HpvZPVRqUsCEZxv61rDs7VFiF9I8TGWi0DKNNwwtJx5ReFU641EN2Dn0PJ5ad29jnNA7NGyG2Md79a9GYQTJJjO3wpvayjNkI4NtKht_dGm9btDV5xwMgIHx0BL8L2HLVsHp5nN25Jo7MkJcngJSlZxllUzlgN9PbtYjvokoYQ9q9t9uH_pwMulS2wmJAjBdszn-US9XZ0XtluC07Ld-0DwdQt352DfzLC837_l9Bz5U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAsZ8iS5lBLA0YBCA-fC-3zo9eu2Oi_Myi4UYkthJuDYv70eQ7MkiC0Q_9jJ2G9J2uR9Ey0ey93EoHt7CLjoGHsXsiXgxFDJhUBCvc9nO3GSENsbiFUXL-vXJKArqT_uFUSp50038YQHQMAfIRymZh3GWFRwqYZmqNDBqTs4_ENQXK6OHJYxTVit4KqV8mDtkDsEl8jTSUFdTkb_bbk7nyNo01Pw7FuHtYrGASx_SjAY7hNYidBYUfRKE0dWf1KBc7FStv8WrEWGDfl',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBkJ3EgXUzftivkqby7KCw_71wmdS8EmeF6BGD6TCiNpcRNvszVCxrDxmPVI0xRac91dCOBAj6xU5XCAx5G0V8M9vuZ3hU5wTEq1jIZJFbp8qNpZprwgG-5a7uEAsI3fU0bpHXqXz4p5YIm2Ynsh5MRliraHahed9foP-s7ZPECI8kC_Bgru3iXRAynnt6pqbe1BRHKf7GjSu64wdq-BFJyGhAzhRXvraMYU8Cywo0DHcuFsT1axJZPLoF9mim26psiO4MvZ0RBjTYb',
  ]
  
  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }
  
  const handleBookService = (serviceId?: string) => {
    setSelectedServiceId(serviceId)
    setBookingOpen(true)
  }
  
  return (
    <>
      {/* Header */}
      <header className="bg-primary pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
              {isAuthenticated && userImage ? (
                <Image 
                  alt="User Profile" 
                  className="w-full h-full object-cover" 
                  src={userImage}
                  width={48}
                  height={48}
                />
              ) : (
                <span className="material-icons-round text-slate-400 text-2xl">person</span>
              )}
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Xin chào,</p>
              <h1 className="text-white text-lg font-bold">
                {isLoading ? '...' : userName}
              </h1>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
              <MapPin className="w-5 h-5" />
            </button>
            <div className="relative">
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-1 right-1 bg-red-500 border-2 border-primary w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold">2</span>
            </div>
          </div>
        </div>
        
        <MobileSearch />
      </header>

      {/* Quick Actions */}
      <section className="px-6 -mt-6 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-xl grid grid-cols-5 gap-2">
          <QuickAction 
            icon={Calendar} 
            label="Đặt lịch" 
            color="bg-blue-500" 
            shadowColor="shadow-blue-500/30"
            onClick={() => handleBookService()}
          />
          <QuickAction 
            icon={Stethoscope} 
            label="Bác sĩ" 
            color="bg-purple-500" 
            shadowColor="shadow-purple-500/30"
            onClick={onNavigateToDoctors}
          />
          <QuickAction icon={Newspaper} label="Tin tức" color="bg-pink-500" shadowColor="shadow-pink-500/30" />
          <QuickAction icon={FolderOpen} label="Hồ sơ" color="bg-emerald-500" shadowColor="shadow-emerald-500/30" />
          <QuickAction icon={Wallet} label="Ví tiền" color="bg-orange-500" shadowColor="shadow-orange-500/30" />
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="mt-8 px-6">
        <SectionHeader 
          title="Lịch Hẹn Sắp Tới" 
          onViewAll={onNavigateToAppointments}
        />
        
        {!isAuthenticated ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
              Đăng nhập để xem lịch hẹn của bạn
            </p>
            <button 
              onClick={() => {/* Navigate to profile tab to login */}}
              className="text-primary font-semibold text-sm hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : isLoadingBookings ? (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl w-[70px] h-[70px]"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded"></div>
                <div className="bg-slate-200 dark:bg-slate-700 h-3 w-1/2 rounded"></div>
                <div className="bg-slate-200 dark:bg-slate-700 h-3 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        ) : nextBooking ? (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-4">
            <div className="bg-primary rounded-2xl p-3 text-center min-w-[70px] flex flex-col justify-center">
              <span className="text-white text-2xl font-black block">
                {new Date(nextBooking.date).getDate()}
              </span>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                TH{new Date(nextBooking.date).getMonth() + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 flex-1 leading-snug">
                  {nextBooking.service.name}
                </h3>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase whitespace-nowrap flex-shrink-0 self-start ${
                  nextBooking.status === 'CONFIRMED' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                  {nextBooking.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                </span>
              </div>
              <div className="space-y-1.5">
                <InfoRow icon="schedule" text={nextBooking.time} />
                <InfoRow icon="payments" text={formatPrice(nextBooking.service.price)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
              Bạn chưa có lịch hẹn nào sắp tới
            </p>
            <button 
              onClick={() => handleBookService()}
              className="text-primary font-semibold text-sm hover:underline"
            >
              Đặt lịch ngay
            </button>
          </div>
        )}
      </section>

      {/* Featured Services */}
      <section className="mt-8 px-6">
        <SectionHeader 
          title="Dịch Vụ Nổi Bật" 
          subtitle="Chọn dịch vụ phù hợp với bạn" 
        />
        
        {isLoadingServices ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative rounded-[24px] overflow-hidden aspect-[1/0.8] bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id}
                image={serviceImages[index % serviceImages.length]}
                title={service.name}
                subtitle={formatPrice(service.price)}
                rating={service.rating}
                ratingsCount={service.ratingsCount}
                onClick={() => handleBookService(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            Chưa có dịch vụ nào
          </div>
        )}
      </section>

      {/* CTV Promotion Banner */}
      <section className="mt-8 px-6">
        <div className="relative w-full aspect-[2/1] rounded-[32px] overflow-hidden shadow-xl">
          <Image 
            alt="Promotion" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5q93zxGiC_PzgRi8BFZJnVsj_vHtmRn-4Lhaskl-FK0A5jtDQOHKAYBNJ_AJFpBrt-FPNQQNmYfxLIFFzL7TU6CDq-nzNFTizpXKC0MOvMDB8Gdkd9UwMWYPgj56HnvOw5Y2P-DvNGYxHuJZGmo8Iyc3Th8w5XXlpt3PYvO_nfFtsFDth0NXuSTGyLRo6hshyaGG3vRj9vdNDthhlACV3ZATGapvN9VUCs9kLEb2vg-j8lLDKwHXK69xa7N_Xur_1XEJwrwHrGp83"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-slate-900/40 flex flex-col justify-center p-6 text-white">
            <h3 className="text-xl font-black mb-1">Trở Thành Cộng Tác Viên</h3>
            <p className="text-xs text-white/90 mb-4 leading-relaxed">Kiếm tiền từ giới thiệu khách hàng</p>
            <div className="flex gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 flex flex-col">
                <span className="text-[8px] opacity-70">Gửi bạn bè</span>
                <span className="text-xs font-bold">200.000đ</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 flex flex-col">
                <span className="text-[8px] opacity-70">Hoa hồng</span>
                <span className="text-xs font-bold">5%</span>
              </div>
            </div>
            <button className="bg-primary text-slate-900 font-bold px-5 py-2 rounded-full w-fit flex items-center gap-2 text-xs shadow-lg">
              Tham gia ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-4 right-6 flex gap-1">
            <span className="w-4 h-1.5 bg-primary rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* Partner Vouchers */}
      <section className="mt-8 px-6">
        <SectionHeader 
          title="WinSmile Đề Xuất" 
          subtitle="Đổi tác voucher ưu đãi" 
        />
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <PartnerCard name="WinMart" color="bg-red-600" />
          <PartnerCard name="Viettel" color="bg-blue-600" />
          <PartnerCard name="Grab" color="bg-emerald-600" />
          <PartnerCard name="Shopee" color="bg-orange-600" />
        </div>
      </section>

      {/* News & Promotions */}
      <section className="mt-8 px-6 mb-8">
        <SectionHeader 
          title="Tin Tức & Ưu Đãi" 
          subtitle="Cập nhật tin tức mới nhất" 
        />
        
        <div className="space-y-4">
          <NewsCard 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuClsngqiYZNLCYNPo9kQ_YCoPUIZQYi2dlm-QVdTNwMc43joksy13aJ2hwy8Grjhl_6-CMA36NJV-hYLZRw0zi6cFQJ1SQ7EDe4P4t3-KRhZnNm__4fHV2yeCUYw0izKVnN9D7N_FUMDYO0YqqdUEr-dnw7vDXbugXoAJXs_x0ia_P1xL5XnSoTbV8sx4GozcwbmaMkqjVL7GWmkI8vKEOj8Sg2QRrju6znmGPz2fKyClnD-QiTHdjCkgnYaLccWK1Shy_NkHivPfDn"
            tag="SỰ KIỆN"
            tagColor="text-primary bg-yellow-50 dark:bg-yellow-900/20"
            date="24/12/2025"
            title="Khai Trương Chi Nhánh WinSmile Đà Nẵng"
            description="Chào mừng chi nhánh mới tại trung tâm Đà Nẵng với đầy đủ trang thiết bị hiện đại"
          />
          <NewsCard 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCS9I8wDsuvvVQz0SER-5LgbU_bOIJNpXHIV8VrIE5wYzksBAL2CT5KN5WEEYDkOfKFoLk7iw4bvdZiMcWTSHzF2nMy2vicYsV5D_gxjyV2zSBDk7kBP74wOy_WhKuZt-bO-iIZ_ng6zS6OLEsL1K3tj1Ioz-LKhGiGXE2lJiFqkTpjQ8-iAMYRzsdvAx4ugdCn_J92TsXUAceFxKHsYkjvDnLaZ4UdJuX9qdeJOyU1LAeTEXCt7M_WcxtYVmep5Cp--aobxg1YhEBO"
            tag="CÔNG NGHỆ"
            tagColor="text-blue-500 bg-blue-50 dark:bg-blue-900/20"
            date="22/12/2025"
            title="Công Nghệ Niềng Răng Invisalign Mới Nhất"
            description="Giải pháp chỉnh nha trong suốt, thẩm mỹ và hiệu quả cao"
          />
        </div>
      </section>
      
      {/* Mobile Booking Dialog */}
      <MobileBooking 
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialServiceId={selectedServiceId}
      />
    </>
  )
}

// Helper Components
function QuickAction({ icon: Icon, label, color, shadowColor, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg ${shadowColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </button>
  )
}

function SectionHeader({ title, subtitle, onViewAll }: { title: string; subtitle?: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="text-primary font-semibold text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full"
        >
          Xem tất cả <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
      <span className="material-icons-round text-sm">{icon}</span>
      <span className="text-xs font-medium">{text}</span>
    </div>
  )
}

function ServiceCard({ 
  image, 
  title, 
  subtitle,
  rating,
  ratingsCount,
  onClick
}: { 
  image: string
  title: string
  subtitle: string
  rating?: number
  ratingsCount?: number
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className="relative rounded-[24px] overflow-hidden aspect-[1/0.8] group cursor-pointer text-left"
    >
      <Image 
        alt={title} 
        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
        src={image}
        fill
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
        <p className="text-white font-bold text-sm mb-1">{title}</p>
        <p className="text-white/90 text-xs font-semibold mb-1">{subtitle}</p>
        {rating && ratingsCount ? (
          <div className="flex items-center gap-1">
            <span className="material-icons-round text-yellow-400 text-sm">star</span>
            <span className="text-white/90 text-[10px] font-medium">
              {rating.toFixed(1)} ({ratingsCount})
            </span>
          </div>
        ) : null}
      </div>
    </button>
  )
}

function PartnerCard({ name, color }: { name: string; color: string }) {
  return (
    <div className="min-w-[80px] flex flex-col items-center gap-2">
      <div className={`w-16 h-16 ${color} rounded-[22px] flex items-center justify-center text-white font-black text-xs p-2 text-center shadow-md`}>
        {name}
      </div>
      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{name}</span>
    </div>
  )
}

function NewsCard({ image, tag, tagColor, date, title, description }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm flex gap-4 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <Image 
          alt={title} 
          className="object-cover" 
          src={image}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="flex-1 py-1">
        <div className="flex gap-2 mb-1">
          <span className={`text-[8px] font-bold ${tagColor} px-2 py-0.5 rounded-full`}>{tag}</span>
          <span className="text-[8px] text-slate-400 font-medium">{date}</span>
        </div>
        <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-1">{title}</h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
