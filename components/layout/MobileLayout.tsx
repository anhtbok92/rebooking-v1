'use client'

import { useState } from 'react'
import { Home, MessageCircle, Calendar, ShoppingCart, User } from 'lucide-react'
import HomePage from '@/components/home/HomePage'
import MessagesPage from '@/components/home/MessagesPage'
import AppointmentsPage from '@/components/home/AppointmentsPage'
import CartPage from '@/components/home/CartPage'
import ProfilePage from '@/components/home/ProfilePage'
import DoctorsPage from '@/components/home/DoctorsPage'
import NewsPage from '@/components/home/NewsPage'
import NewsDetailPage from '@/components/home/NewsDetailPage'
import { useCart } from '@/hooks/use-redux-cart'

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const { cartCount } = useCart()

  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'messages', label: 'Tin nhắn', icon: MessageCircle },
    { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
    { id: 'cart', label: 'Giỏ hàng', icon: ShoppingCart, badge: cartCount },
    { id: 'profile', label: 'Cá nhân', icon: User },
  ]

  const handleNewsClick = (newsId: string) => {
    setSelectedNewsId(newsId)
    setActiveTab('newsDetail')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onNavigateToAppointments={() => setActiveTab('appointments')}
            onNavigateToDoctors={() => setActiveTab('doctors')}
            onNavigateToNews={() => setActiveTab('news')}
            onNavigateToNewsDetail={handleNewsClick}
            onNavigateToCart={() => setActiveTab('cart')}
          />
        )
      case 'messages':
        return <MessagesPage />
      case 'appointments':
        return <AppointmentsPage />
      case 'cart':
        return <CartPage onNavigateToHome={() => setActiveTab('home')} />
      case 'profile':
        return <ProfilePage />
      case 'doctors':
        return <DoctorsPage onBack={() => setActiveTab('home')} />
      case 'news':
        return <NewsPage onBack={() => setActiveTab('home')} onNewsClick={handleNewsClick} />
      case 'newsDetail':
        return selectedNewsId ? (
          <NewsDetailPage 
            newsId={selectedNewsId} 
            onBack={() => setActiveTab('news')} 
          />
        ) : null
      default:
        return (
          <HomePage 
            onNavigateToAppointments={() => setActiveTab('appointments')}
            onNavigateToDoctors={() => setActiveTab('doctors')}
            onNavigateToNews={() => setActiveTab('news')}
            onNavigateToNewsDetail={handleNewsClick}
          />
        )
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 max-w-[430px] mx-auto min-h-screen pb-24">
      {renderContent()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                isActive 
                  ? 'text-primary' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
