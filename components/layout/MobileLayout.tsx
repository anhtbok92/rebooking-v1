'use client'

import { useState } from 'react'
import { Home, MessageCircle, Calendar, Users, User } from 'lucide-react'
import HomePage from '@/components/home/HomePage'
import MessagesPage from '@/components/home/MessagesPage'
import AppointmentsPage from '@/components/home/AppointmentsPage'
import CTVPage from '@/components/home/CTVPage'
import ProfilePage from '@/components/home/ProfilePage'

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'messages', label: 'Tin nhắn', icon: MessageCircle },
    { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
    { id: 'ctv', label: 'CTV', icon: Users },
    { id: 'profile', label: 'Cá nhân', icon: User },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />
      case 'messages':
        return <MessagesPage />
      case 'appointments':
        return <AppointmentsPage />
      case 'ctv':
        return <CTVPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage />
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
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-primary'
              }`}
            >
              <Icon className="w-6 h-6" />
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
