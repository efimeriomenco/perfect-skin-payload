import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Work_Sans, Urbanist } from 'next/font/google'
import React from 'react'
import type { Header as HeaderType, Media } from '@/payload-types'

// SiteSetting type (will be auto-generated after running `npm run generate:types`)
type SiteSetting = {
  siteName?: string | null
  siteTitle?: string | null
  siteDescription?: string | null
  ogImage?: Media | string | null
}

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
})

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

import { Footer } from '@/globals/Footer/Component'
import { Header } from '@/globals/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'
import { TypedLocale } from 'payload'

import './globals.css'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import localization from '@/i18n/localization'

type Args = {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params
  const direction = 'ltr'

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  setRequestLocale(locale)

  const { isEnabled } = await draftMode()
  const messages = await getMessages()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, workSans.variable, urbanist.variable)}
      lang={locale}
      dir={direction}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
      </head>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <LivePreviewListener />
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Default values
  let logoUrl = '/favicon.ico'
  let ogImageUrl: string | undefined
  let siteName = 'Perfect Skin Moldova'
  let siteTitle = 'Perfect Skin Moldova - Epilare, Laser'
  let siteDescription = 'Perfect Skin Moldova este un centru de epilare ce oferă piele netedă, îngrijită și rezultate sigure, de durată.'

  try {
    const header = (await getCachedGlobal('header', 1, 'ro')()) as HeaderType
    const siteSettings = (await getCachedGlobal('site-settings', 1, 'ro')()) as SiteSetting
    const logo = header?.logo

    // Get favicon/icon URL
    if (logo && typeof logo === 'object' && 'url' in logo && logo.url) {
      logoUrl = logo.url.startsWith('http') 
        ? logo.url 
        : `${process.env.NEXT_PUBLIC_SERVER_URL}${logo.url}`
    }

    // Get Open Graph image URL from site settings
    const ogImage = siteSettings?.ogImage
    if (ogImage && typeof ogImage === 'object' && 'url' in ogImage && ogImage.url) {
      ogImageUrl = ogImage.url.startsWith('http')
        ? ogImage.url
        : `${process.env.NEXT_PUBLIC_SERVER_URL}${ogImage.url}`
    }

    // Site metadata from settings
    if (siteSettings?.siteName) siteName = siteSettings.siteName
    if (siteSettings?.siteTitle) siteTitle = siteSettings.siteTitle
    if (siteSettings?.siteDescription) siteDescription = siteSettings.siteDescription
  } catch (error) {
    // Use default values if fetching fails during build
    console.warn('Could not fetch globals for metadata:', error)
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://perfectskin.md'),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    openGraph: mergeOpenGraph({
      title: siteTitle,
      description: siteDescription,
      siteName: siteName,
    }, ogImageUrl),
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
