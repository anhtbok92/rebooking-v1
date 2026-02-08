'use client'

import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useDoctors } from '@/lib/swr'

interface MobileDoctorSelectionProps {
  selectedDoctor: string
  setSelectedDoctor: (id: string) => void
}

export function MobileDoctorSelection({
  selectedDoctor,
  setSelectedDoctor,
}: MobileDoctorSelectionProps) {
  const { data, isLoading } = useDoctors({ page: 1, limit: 50 })
  const doctors = data?.doctors || []

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="flex gap-3 p-4">
              <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Chưa có bác sĩ nào
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {doctors.map((doctor: any) => {
        const isSelected = selectedDoctor === doctor.id
        return (
          <button
            key={doctor.id}
            onClick={() => setSelectedDoctor(doctor.id)}
            className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${
              isSelected 
                ? 'border-primary shadow-lg scale-[1.02]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
          >
            <div className="flex gap-3 p-4 bg-white dark:bg-slate-800">
              {/* Doctor Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name || 'Doctor'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="material-icons-round text-primary text-2xl">person</span>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-icons-round text-white text-sm">check</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-left py-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  {doctor.name || 'Bác sĩ'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {doctor.email}
                </p>
                {doctor.phone && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {doctor.phone}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
