'use client'

import { ArrowLeft, Calendar, Eye, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useNewsItem } from '@/lib/swr'
import { format } from 'date-fns'

export default function NewsDetailPage({ 
  newsId, 
  onBack 
}: { 
  newsId: string
  onBack?: () => void 
}) {
  const { data: news, isLoading } = useNewsItem(newsId)
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        {/* Header Skeleton */}
        <header className="bg-primary pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-white/20 h-6 w-32 rounded animate-pulse"></div>
          </div>
        </header>
        
        {/* Content Skeleton */}
        <div className="px-6 -mt-4 relative z-20">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-700 h-6 w-3/4 rounded"></div>
            <div className="bg-slate-200 dark:bg-slate-700 h-4 w-1/2 rounded"></div>
            <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-full rounded"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-full rounded"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!news) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <header className="bg-primary pt-12 pb-6 px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-white text-xl font-bold">Tin tức</h1>
          </div>
        </header>
        
        <div className="px-6 mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Không tìm thấy tin tức</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="bg-primary pt-12 pb-6 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className={`text-xs font-bold ${getCategoryColor(news.category)} px-3 py-1 rounded-full`}>
            {getCategoryLabel(news.category)}
          </span>
        </div>
      </header>

      {/* Content */}
      <article className="px-6 -mt-4 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          {news.coverImage && (
            <div className="relative w-full aspect-[16/9]">
              <Image 
                alt={news.title} 
                className="object-cover" 
                src={news.coverImage}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="p-6">
            {/* Title */}
            <h1 className="text-xl font-bold mb-4 leading-tight">
              {news.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {news.publishedAt ? format(new Date(news.publishedAt), 'dd/MM/yyyy') : ''}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{news.viewCount} lượt xem</span>
              </div>
            </div>
            
            {/* Excerpt */}
            {news.excerpt && (
              <div 
                className="text-sm text-slate-600 dark:text-slate-300 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700 italic"
                dangerouslySetInnerHTML={{ __html: news.excerpt }}
              />
            )}
            
            {/* Content */}
            <div 
              className="prose prose-sm max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                prose-ul:text-slate-700 dark:prose-ul:text-slate-300
                prose-ol:text-slate-700 dark:prose-ol:text-slate-300
                prose-blockquote:border-l-primary prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
                prose-code:text-primary prose-code:bg-slate-100 dark:prose-code:bg-slate-800
                prose-img:rounded-2xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
            
            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Author */}
            {news.author && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                {news.author.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      alt={news.author.name || 'Author'} 
                      src={news.author.image}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {news.author.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{news.author.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tác giả</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Share Button (Future feature) */}
        <div className="mt-6 mb-8">
          <button className="w-full bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm flex items-center justify-center gap-2 text-primary font-semibold hover:shadow-md transition-shadow">
            <Share2 className="w-5 h-5" />
            Chia sẻ tin tức
          </button>
        </div>
      </article>
    </div>
  )
}
