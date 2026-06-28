import Link from 'next/link'
import type { Story } from '@/types'
import { formatPrice } from '@/lib/utils'

interface StoryCardProps {
  story: Story
  lang?: 'ar' | 'en'
}

export default function StoryCard({ story, lang = 'ar' }: StoryCardProps) {
  const title = lang === 'ar' ? story.title_ar : story.title_en

  return (
    <Link href={`/stories/${story.slug}`} className="no-underline group">
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-transparent shadow-sm transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-sky-200">
        {/* Cover */}
        <div className="h-44 flex items-center justify-center relative text-5xl" style={{ background: story.cover_gradient }}>
          {story.emoji}
          {story.is_featured && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              الأكثر طلباً
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
          <p className="text-gray-400 text-xs mb-3">{story.age_min}–{story.age_max} سنوات · {story.page_count} صفحة</p>

          <div className="flex items-center justify-between">
            <span className="font-black text-sky-500">{formatPrice(story.price_sar, 'SAR', lang)}</span>
            <button className="bg-sky-50 text-sky-500 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-sky-500 hover:text-white transition-colors">
              اختر ←
            </button>
          </div>

          {/* Rating */}
          {story.rating_count > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-gray-500">{story.rating_avg.toFixed(1)} ({story.rating_count})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
