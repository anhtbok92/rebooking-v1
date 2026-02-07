'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'signin' | 'signup'
  onSwitchMode: () => void
}

// Sign In Form Data
interface SignInFormData {
  email: string
  password: string
}

// Sign Up Form Data
interface SignUpFormData {
  name: string
  email: string
  phone: string
  password: string
}

// Sign In Schema
const signinSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
})

// Sign Up Schema
const signupSchema = yup.object({
  name: yup.string().required('Vui lòng nhập họ tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup
    .string()
    .matches(/^\+?[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  password: yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
})

export function AuthDialog({ open, onOpenChange, mode, onSwitchMode }: AuthDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signinForm = useForm<SignInFormData>({
    resolver: yupResolver(signinSchema),
  })

  const signupForm = useForm<SignUpFormData>({
    resolver: yupResolver(signupSchema),
  })

  const currentForm = mode === 'signin' ? signinForm : signupForm

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Đăng nhập Google thất bại')
    }
  }

  const onSignIn = async (data: SignInFormData) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', { ...data, redirect: false })
      if (result?.error) {
        toast.error('Email hoặc mật khẩu không đúng')
        return
      }
      toast.success('Đăng nhập thành công!')
      signinForm.reset()
      onOpenChange(false)
      // Reload to update session
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch {
      toast.error('Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSignUp = async (data: SignUpFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/v1/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'CLIENT' }),
      })
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Tạo tài khoản thất bại')

      toast.success('Tạo tài khoản thành công!')
      signupForm.reset()
      // Switch to sign in mode
      onSwitchMode()
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-3xl p-0 gap-0">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader className="bg-primary pt-8 pb-6 px-6 rounded-t-3xl">
          <DialogTitle className="text-2xl font-bold text-slate-900 text-center">
            {mode === 'signin' ? 'Đăng Nhập' : 'Đăng Ký'}
          </DialogTitle>
          <DialogDescription className="text-slate-700 text-center">
            {mode === 'signin' 
              ? 'Chào mừng bạn quay lại!' 
              : 'Tạo tài khoản mới để bắt đầu'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full mb-4 flex items-center justify-center gap-2 rounded-2xl py-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Tiếp tục với Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Hoặc</span>
            </div>
          </div>

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={signinForm.handleSubmit(onSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="email@example.com"
                  className="rounded-xl"
                  {...signinForm.register('email')}
                />
                {signinForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{signinForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-medium">Mật khẩu</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                  {...signinForm.register('password')}
                />
                {signinForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{signinForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">Họ và tên</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="rounded-xl"
                  {...signupForm.register('name')}
                />
                {signupForm.formState.errors.name && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="email@example.com"
                  className="rounded-xl"
                  {...signupForm.register('email')}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-sm font-medium">Số điện thoại</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+84 123 456 789"
                  className="rounded-xl"
                  {...signupForm.register('phone')}
                />
                {signupForm.formState.errors.phone && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium">Mật khẩu</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                  {...signupForm.register('password')}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-slate-900 font-bold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
              </Button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">
              {mode === 'signin' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </span>{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-primary font-semibold hover:underline"
            >
              {mode === 'signin' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
