'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Calendar, Package, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'booking' | 'service'
  title: string
  subtitle: string
  status?: string
  url: string
}

interface SearchResponse {
  bookings: SearchResult[]
  services: SearchResult[]
}

interface MobileSearchProps {
  onFocus?: () => void
}

export function MobileSearch({ onFocus }: MobileSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse>({ bookings: [], services: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Search debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ bookings: [], services: [] })
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults({
            bookings: data.bookings || [],
            services: data.services || [],
          })
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const allResults = [...results.services, ...results.bookings]

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault()
      handleResultClick(allResults[selectedIndex])
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'booking' ? <Calendar className="w-4 h-4" /> : <Package className="w-4 h-4" />
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    const statusColors: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    }

    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    }

    return (
      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', statusColors[status] || '')}>
        {statusLabels[status] || status}
      </Badge>
    )
  }

  return (
    <>
      {/* Search Input Trigger */}
      <div className="relative z-10 group">
        <input
          className="w-full bg-white text-slate-800 placeholder:text-slate-400 border-none rounded-2xl py-3.5 pl-12 pr-4 shadow-xl focus:ring-2 focus:ring-yellow-300 transition-all outline-none"
          placeholder="Tìm dịch vụ, bác sĩ..."
          type="text"
          onFocus={() => {
            setIsOpen(true)
            onFocus?.()
          }}
          readOnly
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      </div>

      {/* Search Dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setQuery('')
        }}
      >
        <DialogContent className="p-0 border-0 w-full max-w-[430px] mx-auto shadow-xl rounded-3xl bg-white dark:bg-slate-900 overflow-hidden top-[10%] translate-y-0">
          <DialogTitle className="sr-only">Tìm kiếm dịch vụ và bác sĩ</DialogTitle>
          <DialogDescription className="sr-only">
            Tìm kiếm dịch vụ nha khoa và lịch hẹn của bạn
          </DialogDescription>
          
          {/* Search Input */}
          <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm dịch vụ, bác sĩ..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 focus:outline-none text-base bg-transparent"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : query.length < 2 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Nhập ít nhất 2 ký tự để tìm kiếm
              </div>
            ) : allResults.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Không tìm thấy kết quả cho "{query}"
              </div>
            ) : (
              <div className="p-2">
                {/* Services */}
                {results.services.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
                      Dịch vụ ({results.services.length})
                    </div>
                    {results.services.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'w-full flex items-start gap-3 px-3 py-3 rounded-2xl transition-colors text-left',
                          selectedIndex === index && 'bg-primary/10'
                        )}
                      >
                        <div className="mt-0.5 text-slate-400">{getTypeIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{result.title}</p>
                          <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bookings */}
                {results.bookings.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
                      Lịch hẹn ({results.bookings.length})
                    </div>
                    {results.bookings.map((result, index) => {
                      const offset = results.services.length
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            'w-full flex items-start gap-3 px-3 py-3 rounded-2xl transition-colors text-left',
                            selectedIndex === offset + index && 'bg-primary/10'
                          )}
                        >
                          <div className="mt-0.5 text-slate-400">{getTypeIcon(result.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm truncate">{result.title}</p>
                              {getStatusBadge(result.status)}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {allResults.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 text-center">
              Tìm thấy {allResults.length} kết quả
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
