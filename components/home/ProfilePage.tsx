'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AuthDialog } from './AuthDialog'
import Image from 'next/image'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleSignIn = () => {
    setAuthMode('signin')
    setAuthDialogOpen(true)
  }

  const handleSignUp = () => {
    setAuthMode('signup')
    setAuthDialogOpen(true)
  }

  const handleSwitchMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      toast.success('Đăng xuất thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-round text-5xl text-primary">person_outline</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Cá Nhân</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Vui lòng đăng nhập để xem thông tin cá nhân
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleSignIn}
                className="w-full bg-primary text-slate-900 font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-primary/90 transition-colors"
              >
                Đăng Nhập
              </button>
              <button 
                onClick={handleSignUp}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold py-3 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>

        <AuthDialog 
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          mode={authMode}
          onSwitchMode={handleSwitchMode}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt="Profile" 
              width={96}
              height={96}
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="material-icons-round text-5xl text-white">person</span>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1">{session.user?.name || 'Người dùng'}</h2>
        <p className="text-slate-500 dark:text-slate-400">{session.user?.email}</p>
      </div>

      <div className="space-y-3">
        <ProfileMenuItem icon="person" label="Thông tin cá nhân" />
        <ProfileMenuItem icon="history" label="Lịch sử đặt lịch" />
        <ProfileMenuItem icon="favorite" label="Yêu thích" />
        <ProfileMenuItem icon="settings" label="Cài đặt" />
        <ProfileMenuItem icon="help" label="Trợ giúp" />
        <ProfileMenuItem 
          icon="logout" 
          label="Đăng xuất" 
          danger 
          onClick={handleSignOut}
        />
      </div>
    </div>
  )
}

function ProfileMenuItem({ 
  icon, 
  label, 
  danger,
  onClick 
}: { 
  icon: string
  label: string
  danger?: boolean
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700 hover:border-primary transition-colors ${danger ? 'text-red-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="material-icons-round">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="material-icons-round text-slate-400">chevron_right</span>
    </button>
  )
}
