'use client'

import React, { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { TypedLocale } from 'payload'
import localization from '@/i18n/localization'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function FooterLocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value as TypedLocale },
      )
    })
  }

  const currentLocale = localization.locales.find((loc) => loc.code === locale)

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger className="flex items-center gap-2 text-sm text-[#A4A9AA] hover:text-white bg-transparent border-none focus:ring-0 focus:outline-none w-auto min-w-[120px]">
        <Globe className="h-4 w-4 flex-shrink-0" />
        <SelectValue>{currentLocale?.label || locale}</SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[150px] bg-white text-black rounded-lg z-50">
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((loc) => (
            <SelectItem key={loc.code} value={loc.code}>
              {loc.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
