'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { usePathname } from '@/i18n/routing'

import type { Header as HeaderType } from '@/payload-types'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utilities/ui'
import { LayoutGrid } from 'lucide-react'

type NavItems = HeaderType['navItems']

// Helper to get the href from a link object
function getLinkHref(link: NonNullable<NavItems>[number]['link']): string {
  if (!link) return '#'

  if (link.type === 'reference' && link.reference) {
    const { relationTo, value } = link.reference
    if (typeof value === 'object' && value?.slug) {
      return relationTo === 'pages' ? `/${value.slug}` : `/${relationTo}/${value.slug}`
    }
  }

  if (link.type === 'custom' && link.url) {
    return link.url
  }

  return '#'
}

// Nav item with sub-items dropdown (hover-to-open)
const NavItemWithDropdown: React.FC<{
  link: NonNullable<NavItems>[number]['link']
  subItems: NonNullable<NavItems>[number]['subItems']
  isLinkActive: (href: string) => boolean
}> = ({ link, subItems, isLinkActive }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center"
      >
        <DropdownMenuTrigger asChild>
          <button className="text-black tracking-[25%] font-normal md:text-xs lg:text-sm xl:text-base font-work-sans hover:opacity-70 transition-opacity">
            {link?.label}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={12}
          className="min-w-[240px] bg-white text-black rounded-md border border-[#E5E0DA] shadow-lg p-0 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {subItems?.map(({ link: subLink }, subIndex) => {
            const subHref = getLinkHref(subLink)
            const isSubActive = isLinkActive(subHref)
            const isLast = subIndex === (subItems?.length ?? 0) - 1
            return (
              <DropdownMenuItem
                key={subIndex}
                asChild
                className={cn(
                  'cursor-pointer rounded-none px-7 py-3 text-base font-normal font-work-sans',
                  'hover:bg-[#FFF8F3] focus:bg-[#FFF8F3] hover:text-black focus:text-black',
                  'transition-colors duration-150',
                  isSubActive && 'bg-[#FFF8F3] font-medium',
                )}
              >
                <Link href={subHref} className="w-full flex items-center gap-4">
                  <LayoutGrid className="w-5 h-5" />
                  <span>{subLink?.label}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}

export const HeaderNav: React.FC<{ navItems?: NavItems }> = ({ navItems = [] }) => {
  const pathname = usePathname()

  if (!navItems || navItems.length === 0) {
    return null
  }

  // Check if a link is active (exact match or nested route)
  const isLinkActive = (href: string): boolean => {
    if (href === '#') return false
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && (pathname === href || pathname.startsWith(href + '/'))) return true
    return false
  }

  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item, i) => {
        const { link, subItems } = item
        const hasSubItems = subItems && Array.isArray(subItems) && subItems.length > 0
        const itemHref = getLinkHref(link)

        if (hasSubItems) {
          return (
            <NavItemWithDropdown
              key={i}
              link={link}
              subItems={subItems}
              isLinkActive={isLinkActive}
            />
          )
        }

        return (
          <Link
            key={i}
            href={itemHref}
            className="text-black tracking-[25%] font-normal md:text-xs lg:text-sm xl:text-base font-work-sans hover:opacity-70 transition-opacity"
          >
            {link?.label}
          </Link>
        )
      })}
    </nav>
  )
}
