'use client'

import { ArrowLeft, Search, Star, Calendar, Award } from 'lucide-react'
import Image from 'next/image'
import { useDoctors } from '@/lib/swr/hooks/users'
import type { User } from '@/lib/swr/hooks/users'
import { useState } from 'react'

export default function DoctorsPage({ onBack }: { onBack?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading } = useDoctors({ page: 1, limit: 50 })
  const doctors = data?.doctors || []
  
  // Filter doctors by search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-primary pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Đội Ngũ Bác Sĩ</h1>
            <p className="text-white/80 text-xs">Chọn bác sĩ phù hợp với bạn</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
          />
        </div>
      </header>

      {/* Doctors List */}
      <section className="px-6 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded"></div>
                    <div className="bg-slate-200 dark:bg-slate-700 h-3 w-1/2 rounded"></div>
                    <div className="bg-slate-200 dark:bg-slate-700 h-3 w-2/3 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-round text-slate-400 text-4xl">person_search</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {searchQuery ? 'Không tìm thấy bác sĩ phù hợp' : 'Chưa có bác sĩ nào'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function DoctorCard({ doctor }: { doctor: User }) {
  // Generate random stats for demo (in real app, this would come from database)
  const experience = Math.floor(Math.random() * 15) + 5 // 5-20 years
  const patients = Math.floor(Math.random() * 500) + 100 // 100-600 patients
  const rating = (Math.random() * 0.5 + 4.5).toFixed(1) // 4.5-5.0 rating
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-purple-600">
          {(doctor as any).image ? (
            <Image 
              src={(doctor as any).image} 
              alt={doctor.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <span className="material-icons-round text-4xl">person</span>
            </div>
          )}
          {/* Online Status */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">
                BS. {doctor.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {doctor.email}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full flex-shrink-0 ml-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">{rating}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {experience} năm KN
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-sm text-blue-500">groups</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {patients}+ BN
              </span>
            </div>
          </div>
          
          {/* Phone */}
          {doctor.phone && (
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons-round text-sm text-slate-400">phone</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">{doctor.phone}</span>
            </div>
          )}
          
          {/* Action Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
            <Calendar className="w-4 h-4" />
            Đặt lịch với bác sĩ
          </button>
        </div>
      </div>
    </div>
  )
}
