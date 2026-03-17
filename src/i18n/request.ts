import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

import en from './messages/en.json'

type Messages = typeof en

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  // Try to load messages for the locale, fallback to English if not found
  let messages
  try {
    messages = (await import(`./messages/${locale}.json`)).default
  } catch (error) {
    console.warn(`Messages file for locale "${locale}" not found, falling back to English`)
    messages = (await import(`./messages/en.json`)).default
  }

  return {
    locale,
    messages,
  }
})
