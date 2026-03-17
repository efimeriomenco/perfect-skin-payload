'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'
import { useLocale } from 'next-intl'
import localization from '@/i18n/localization'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { TypedLocale } from 'payload'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe, Menu, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [showFixedHeader, setShowFixedHeader] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const NAVBAR_HEIGHT = 100

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Track scroll position to show/hide fixed header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setShowFixedHeader(currentScrollY > NAVBAR_HEIGHT)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = header?.navItems || []
  const logo = header?.logo
  const menuLabel = header?.menuLabel || 'Meniu'
  const ctaButton = header?.ctaButton

  // Desktop Header Content
  const desktopHeaderContent = (
    <div className="container hidden lg:flex items-center py-4 lg:py-0 relative h-full">
      {/* Left: Logo */}
      <div className="flex items-center z-10 flex-1">
        <a href="/">
          <span className="flex items-center justify-center w-32">
            {logo && typeof logo === 'object' && (
              <img
                src={logo.url || ''}
                alt={logo.alt || ''}
                className="h-24 w-24 object-contain"
              />
            )}
          </span>
        </a>
      </div>

      {/* Center: Nav Menu */}
      <div className="flex items-center gap-10 z-10">
        <HeaderNav navItems={navItems} />
      </div>

      {/* Right: Button + Language Selector */}
      <div className="flex items-center gap-3 z-10 flex-1 justify-end ml-5">
        {ctaButton?.label && ctaButton?.link && (
          <CMSLink
            {...ctaButton.link}
            label={ctaButton.label}
            appearance="default"
            className="xl:px-8 py-3 font-bold! rounded-xs! bg-[#3F3F3F] hover:bg-[#3F3F3F]/90 text-white font-work-sans tracking-[25%] lg:text-sm! text-xs!"
          />
        )}
        <LocaleSwitcher />
      </div>
    </div>
  )

  // Mobile Header Content
  const mobileHeaderContent = (
    <div className="container flex lg:hidden items-center justify-between py-4 relative h-full">
      {/* Left: Hamburger Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#2C2C2C] hover:bg-black/5 z-10">
            <Menu className="h-6! w-6!" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[350px] sm:w-[350px] bg-white border-r-0 p-0"
        >
          <SheetHeader className="p-6 border-b border-black/10">
            <SheetTitle className="text-[#2C2C2C] font-work-sans text-left">
              {menuLabel}
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Navigation */}
          <nav className="flex flex-col p-4">
            {navItems &&
              navItems.length > 0 &&
              navItems.map((item, i) => {
                const { link, subItems } = item
                const hasSubItems = subItems && Array.isArray(subItems) && subItems.length > 0

                if (hasSubItems) {
                  return (
                    <MobileNavItemWithSub
                      key={i}
                      item={item}
                      onClose={() => setMobileMenuOpen(false)}
                    />
                  )
                }

                return (
                  <div key={i} onClick={() => setMobileMenuOpen(false)}>
                    <CMSLink
                      {...link}
                      label={null}
                      className="flex items-center justify-between py-4 px-2 text-[#2C2C2C] font-work-sans text-lg border-b border-black/10 hover:bg-black/5 transition-colors"
                    >
                      <span>{link?.label}</span>
                      <ChevronRight className="h-5 w-5 text-black/50" />
                    </CMSLink>
                  </div>
                )
              })}
          </nav>

          {/* Mobile CTA Button */}
          {ctaButton?.label && ctaButton?.link && (
            <div className="p-6 mt-auto" onClick={() => setMobileMenuOpen(false)}>
              <CMSLink
                {...ctaButton.link}
                label={ctaButton.label}
                appearance="default"
                className="w-full text-center px-8 py-4 font-bold! rounded-xs! bg-[#3F3F3F] hover:bg-[#3F3F3F]/90 text-white font-work-sans"
              />
            </div>
          )}

          {/* Mobile Language Selector */}
          <div className="p-6 border-t border-black/10">
            <MobileLocaleSwitcher />
          </div>
        </SheetContent>
      </Sheet>

      {/* Center: Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <a href="/">
          {logo && typeof logo === 'object' && (
            <img
              src={logo.url || ''}
              alt={logo.alt || ''}
              className="h-16 w-16 object-contain"
            />
          )}
        </a>
      </div>

      {/* Right: Language Selector */}
      <div className="z-10">
        <LocaleSwitcher />
      </div>
    </div>
  )

  return (
    <>
      {/* Sticky Header — always in document flow */}
      <header
        className="sticky top-0 left-0 right-0 z-40 w-full h-[70px] lg:h-[100px] bg-white text-[#2C2C2C]"
        style={{
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {desktopHeaderContent}
        {mobileHeaderContent}
      </header>

      {/* Fixed Header — appears after scrolling past navbar height */}
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full h-[70px] lg:h-[100px] text-[#2C2C2C]"
        style={{
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          transition:
            'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease, filter 0.5s ease',
          transform: showFixedHeader ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showFixedHeader ? 1 : 0,
          filter: showFixedHeader ? 'blur(0px)' : 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: showFixedHeader ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
          backdropFilter: 'blur(10px)',
        }}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {desktopHeaderContent}
        {mobileHeaderContent}
      </header>
    </>
  )
}

// Mobile Nav Item with Subitems
function MobileNavItemWithSub({
  item,
  onClose,
}: {
  item: NonNullable<Header['navItems']>[number]
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { link, subItems } = item

  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 px-2 text-[#2C2C2C] font-work-sans text-lg hover:bg-black/5 transition-colors"
      >
        {link?.label}
        <ChevronRight
          className={cn(
            'h-5 w-5 text-black/50 transition-transform duration-200',
            isOpen && 'rotate-90',
          )}
        />
      </button>

      {isOpen && subItems && (
        <div className="pl-4 pb-2">
          {subItems.map(({ link: subLink }, subIndex) => (
            <div key={subIndex} onClick={onClose}>
              <CMSLink
                {...subLink}
                label={null}
                className="flex items-center py-3 px-2 text-[#4A4A4A] font-work-sans text-base hover:text-[#2C2C2C] hover:bg-black/5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#3F3F3F] mr-3" />
                <span>{subLink?.label}</span>
              </CMSLink>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const [isOpen, setIsOpen] = useState(false)

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value },
      )
    })
    setIsOpen(false)
  }

  return (
    <div className="group relative hidden lg:flex items-center gap-3 lg:gap-6">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-[#2C2C2C] hover:text-[#2C2C2C] hover:!bg-transparent focus:!bg-transparent active:!bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-offset-0 [&[data-state=open]]:!bg-transparent [&[data-state=open]]:border-none px-0"
          >
            <Globe className="h-7 w-7 flex-shrink-0" />
            <ChevronDown
              className={cn(
                'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[150px] bg-white text-black rounded-lg p-2 space-y-1 z-50"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {localization.locales
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((loc) => (
              <DropdownMenuItem
                key={loc.code}
                onClick={() => onSelectChange(loc.code as TypedLocale)}
                className={cn(
                  'cursor-pointer font-medium hover:bg-[#3F3F3F] hover:text-white focus:hover:bg-[#3F3F3F] focus:text-white',
                  locale === loc.code && 'bg-[#3F3F3F] text-white',
                )}
              >
                {loc.label}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MobileLocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error
        { pathname, params },
        { locale: value },
      )
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-black/60 text-sm font-work-sans mb-2">Language</span>
      <div className="flex gap-2">
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((loc) => (
            <button
              key={loc.code}
              onClick={() => onSelectChange(loc.code as TypedLocale)}
              className={cn(
                'px-4 py-2 rounded-lg font-work-sans text-sm transition-colors cursor-pointer',
                locale === loc.code
                  ? 'bg-[#3F3F3F] text-white'
                  : 'bg-black/10 text-black/80 hover:bg-black/20',
              )}
            >
              {loc.label}
            </button>
          ))}
      </div>
    </div>
  )
}
