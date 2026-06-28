import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qisatiana.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Try to get stories from DB, gracefully fail if no connection
  let storyPages: MetadataRoute.Sitemap = []
  try {
    const { createAdminClient } = await import('@/lib/supabase')
    const supabase = createAdminClient()
    const { data: stories } = await supabase.from('stories').select('slug, updated_at').eq('is_active', true)
    storyPages = (stories || []).map((story: any) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {}

  return [...staticPages, ...storyPages]
}
