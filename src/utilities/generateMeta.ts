import type { Metadata } from 'next'

import type { Media, Page, Post } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getCachedGlobal } from './getGlobals'

// SiteSetting type (matches the global config)
type SiteSetting = {
  siteName?: string | null
  siteTitle?: string | null
  siteDescription?: string | null
  ogImage?: Media | string | null
}

/**
 * Get image URL handling both relative and absolute URLs (Vercel Blob, etc.)
 */
const getImageUrl = (image: Media | string | null | undefined): string | undefined => {
  if (!image) return undefined
  
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SERVER_URL}${image}`
  }
  
  if (typeof image === 'object' && 'url' in image && image.url) {
    return image.url.startsWith('http') 
      ? image.url 
      : `${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`
  }
  
  return undefined
}

export const generateMeta = async (args: { doc: Page | Post }): Promise<Metadata> => {
  const { doc } = args || {}

  // Fetch site settings for fallback values
  const siteSettings = (await getCachedGlobal('site-settings', 1, 'ro')()) as SiteSetting

  // Page-specific OG image or fall back to site settings
  const pageOgImage = getImageUrl(doc?.meta?.image as Media | null)
  const defaultOgImage = getImageUrl(siteSettings?.ogImage as Media | null)
  const ogImage = pageOgImage || defaultOgImage

  // Page-specific title or fall back to site settings
  const title = doc?.meta?.title || siteSettings?.siteTitle || ''
  
  // Page-specific description or fall back to site settings
  const description = doc?.meta?.description || siteSettings?.siteDescription || ''

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
