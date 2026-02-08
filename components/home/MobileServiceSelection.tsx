'use client'

import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

type Service = {
  id: string
  name: string
  price: number
  imageUrl?: string | null
}

interface MobileServiceSelectionProps {
  services: Service[]
  selectedService: string
  setSelectedService: (id: string) => void
  isLoading?: boolean
}

const defaultServiceImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_90PHSxS095lP6_7HlW9dFxxkujV-L90MtHrBnWEzNDByqkN75f60cxRlHD6GkEoe7MDQw_ANcKqzgpsWezm8IVuZZXJaJmndr1YvSTtlbnHKJum_PKbBfMJ3_XzVlKDEtOhsUGb1-nFtpcrRXCxcVsxGqBnoc2dRJCVJna0IjjNT-aNbpRCc4TDYS6M4P0wfKV5n5kql_bdw4wW8Om1d928VN0R3p46HGhQoqA1ELjm1s_usYJWQVGDXgKXtv72Zm0DOPjrItchp'

export function MobileServiceSelection({
  services,
  selectedService,
  setSelectedService,
  isLoading = false,
}: MobileServiceSelectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="flex gap-3 p-3">
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {services.map((service) => {
        const isSelected = selectedService === service.id
        return (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${
              isSelected 
                ? 'border-primary shadow-lg scale-[1.02]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
          >
            <div className="flex gap-3 p-3 bg-white dark:bg-slate-800">
              {/* Service Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={service.imageUrl || defaultServiceImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-icons-round text-white text-sm">check</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="flex-1 text-left py-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-1">
                  {service.name}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-primary text-base">
                    {service.price.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">đ</span>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
