'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Post
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const locale = useLocale()
  const t = useTranslations()
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, featuredImage, shortDescription } = doc || {}
  const { description: metaDescription, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title

  // Prefer dedicated fields, fall back to SEO meta fields
  const image = featuredImage && typeof featuredImage === 'object' ? featuredImage : (metaImage && typeof metaImage !== 'string' ? metaImage : null)
  const descriptionText = (shortDescription || metaDescription || '')?.replace(/\s/g, ' ')
  const href = `/${locale}/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-[#D7D8DB] rounded-lg overflow-hidden bg-card hover:cursor-pointer group',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-5/3 overflow-hidden">
        {!image && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {image && (
          <Media
            resource={image}
            imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        )}
      </div>
      <div className="p-5">
        {showCategories && hasCategories && (
          <div className="uppercase text-xs tracking-wider text-muted-foreground mb-3">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'
                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}
        {titleToUse && (
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-2 font-urbanist leading-snug">
            <Link className="hover:underline" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {descriptionText && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 font-urbanist">
            {descriptionText}
          </p>
        )}
        <Link
          href={href}
          className="inline-block px-5 py-2.5 bg-[#3F3F3F] text-white text-xs font-semibold uppercase tracking-widest rounded-xs font-urbanist hover:bg-[#2C2C2C] transition-colors"
        >
          {t('read-more')}
        </Link>
      </div>
    </article>
  )
}
