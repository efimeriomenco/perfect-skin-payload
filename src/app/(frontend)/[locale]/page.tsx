import { Metadata } from 'next'
// import PageTemplate from './[slug]/page'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { TypedLocale } from 'payload'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import type { Page as PageType } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { ServiceSidebar } from '@/components/ServiceSidebar'
import PageClient from './[slug]/page.client'

type Args = {
  params: Promise<{
    slug?: string
    locale: TypedLocale
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { slug = 'home', locale = 'en' } = await paramsPromise
  const searchParams = await searchParamsPromise
  const url = '/' + slug

  let page: PageType | null

  page = await queryPage({
    slug,
    locale,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, title, layoutType } = page
  const hasSidebar = layoutType === 'withSidebar'

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      <RenderHero {...hero} pageTitle={title} />

      {hasSidebar ? (
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-12">
            <div className="min-w-0 [&_.container]:max-w-none [&_.container]:px-0 [&_.container]:mx-0">
              <RenderBlocks blocks={layout} locale={locale} searchParams={searchParams} />
            </div>
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-[116px]">
                <ServiceSidebar
                  contactTitle={page.sidebarContactTitle}
                  contactItems={page.sidebarContactItems}
                  buttons={page.sidebarButtons}
                  media={page.sidebarMedia}
                />
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <RenderBlocks blocks={layout} locale={locale} searchParams={searchParams} />
      )}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale = 'en', slug = 'home' } = await params
  const page = await queryPage({
    locale,
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPage = cache(async ({ locale, slug }: { locale: TypedLocale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    locale: locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
