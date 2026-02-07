'use client'

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { MapPin, Phone, Mail, Navigation, X } from 'lucide-react'
import { useClinicAddress } from '@/lib/swr'

interface ClinicMapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClinicMapDialog({ open, onOpenChange }: ClinicMapDialogProps) {
  const { data: clinicAddress, isLoading } = useClinicAddress()
  
  const handleOpenInMaps = () => {
    if (!clinicAddress?.latitude || !clinicAddress?.longitude) {
      // If no coordinates, search by address
      const query = encodeURIComponent(clinicAddress?.address || 'Phòng khám')
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    } else {
      // Open with coordinates
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${clinicAddress.latitude},${clinicAddress.longitude}`,
        '_blank'
      )
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Địa chỉ phòng khám</DialogTitle>
        <DialogDescription className="sr-only">
          Xem địa chỉ và thông tin liên hệ của phòng khám
        </DialogDescription>
        
        {/* Header */}
        <div className="bg-primary p-4 relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Địa Chỉ Phòng Khám</h3>
              <p className="text-white/80 text-xs">Thông tin liên hệ</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-1/2 rounded animate-pulse"></div>
            </div>
          ) : clinicAddress?.address ? (
            <>
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Địa chỉ</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {clinicAddress.address}
                  </p>
                </div>
              </div>
              
              {/* Phone */}
              {clinicAddress.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Số điện thoại</p>
                    <a 
                      href={`tel:${clinicAddress.phone}`}
                      className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-primary transition-colors"
                    >
                      {clinicAddress.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Email */}
              {clinicAddress.email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email</p>
                    <a 
                      href={`mailto:${clinicAddress.email}`}
                      className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-primary transition-colors"
                    >
                      {clinicAddress.email}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Map Preview */}
              {clinicAddress.latitude && clinicAddress.longitude && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${clinicAddress.latitude},${clinicAddress.longitude}&zoom=15`}
                  />
                </div>
              )}
              
              {/* Action Button */}
              <button
                onClick={handleOpenInMaps}
                className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                Mở trong Google Maps
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Chưa có thông tin địa chỉ
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
