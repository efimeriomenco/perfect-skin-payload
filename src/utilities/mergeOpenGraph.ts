import type { Metadata } from 'next'

/**
 * Merge Open Graph metadata with defaults
 * @param og - Open Graph metadata to merge
 * @param defaultImage - Default OG image URL (from Site Settings)
 */
export const mergeOpenGraph = (og?: Metadata['openGraph'], defaultImage?: string): Metadata['openGraph'] => {
  const baseOpenGraph: Metadata['openGraph'] = {
    type: 'website',
  }

  // Use provided image or fall back to default
  const images = og?.images 
    ? og.images 
    : defaultImage 
      ? [{ url: defaultImage }] 
      : undefined

  return {
    ...baseOpenGraph,
    ...og,
    images,
  }
}
