'use client'

import { ArrowLeft, Calendar, Newspaper, Search } from 'lucide-react'
import Image from 'next/image'
import { useNews } from '@/lib/swr'
import { useState } from 'react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewsPage({ onBack, onNewsClick }: { 
  onBack?: () => void
  onNewsClick?: (newsId: string) => void
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('ALL')
  
  const { data, isLoading } = useNews({
    page,
    limit: 10,
    search: search || undefined,
    category: category !== 'ALL' ? category : undefined,
    published: true,
  })
  
  const news = data?.news || []
  const pagination = data?.pagination
  
  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NEWS':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'PROMOTION':
        return 'text-primary bg-yellow-50 dark:bg-yellow-900/20'
      case 'EVENT':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }
  
  // Helper function to get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'NEWS':
        return 'TIN TỨC'
      case 'PROMOTION':
        return 'ƯU ĐÃI'
      case 'EVENT':
        return 'SỰ KIỆN'
      default:
        return category
    }
  }
  
  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="bg-primary pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Tin Tức & Ưu Đãi</h1>
            <p className="text-white/80 text-xs">Cập nhật tin tức mới nhất</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="px-6 -mt-4 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm tin tức..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 bg-slate-50 dark:bg-slate-900 border-0"
            />
          </div>
          
          {/* Category Filter */}
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
            <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả danh mục</SelectItem>
              <SelectItem value="NEWS">Tin tức</SelectItem>
              <SelectItem value="PROMOTION">Ưu đãi</SelectItem>
              <SelectItem value="EVENT">Sự kiện</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* News List */}
      <section className="mt-6 px-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm flex gap-4 border border-slate-100 dark:border-slate-700 animate-pulse">
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 py-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-full" />
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 w-20 rounded" />
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-700 h-4 w-full rounded" />
                  <div className="bg-slate-200 dark:bg-slate-700 h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="space-y-4">
              {news.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onNewsClick?.(item.id)}
                  className="bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm flex gap-4 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image 
                      alt={item.title} 
                      className="object-cover" 
                      src={item.coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuClsngqiYZNLCYNPo9kQ_YCoPUIZQYi2dlm-QVdTNwMc43joksy13aJ2hwy8Grjhl_6-CMA36NJV-hYLZRw0zi6cFQJ1SQ7EDe4P4t3-KRhZnNm__4fHV2yeCUYw0izKVnN9D7N_FUMDYO0YqqdUEr-dnw7vDXbugXoAJXs_x0ia_P1xL5XnSoTbV8sx4GozcwbmaMkqjVL7GWmkI8vKEOj8Sg2QRrju6znmGPz2fKyClnD-QiTHdjCkgnYaLccWK1Shy_NkHivPfDn'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex gap-2 mb-1">
                      <span className={`text-[8px] font-bold ${getCategoryColor(item.category)} px-2 py-0.5 rounded-full`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-[8px] text-slate-400 font-medium">
                        {item.publishedAt ? format(new Date(item.publishedAt), 'dd/MM/yyyy') : ''}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {stripHtml(item.excerpt || item.content.substring(0, 100) + '...')}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-slate-400">
                      <span className="material-icons-round text-xs">visibility</span>
                      <span className="text-[10px]">{item.viewCount} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trang {pagination.page} / {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 bg-primary text-slate-900 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <Newspaper className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-sm font-bold mb-2">Không tìm thấy tin tức</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {search || category !== 'ALL' 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có tin tức nào được xuất bản'
              }
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
