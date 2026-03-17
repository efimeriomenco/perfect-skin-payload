import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Work_Sans, Urbanist } from 'next/font/google'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'

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
  const header = (await getCachedGlobal('header', 1, 'ro')()) as HeaderType
  const logo = header?.logo

  const logoUrl =
    logo && typeof logo === 'object' && 'url' in logo && logo.url
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${logo.url}`
      : '/favicon.ico'

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://perfectskin.md'),
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
