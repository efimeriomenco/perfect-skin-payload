'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { FormBlock } from '@/blocks/Form/Component'

type FooterWrapperProps = {
  contactForm?: FormType | string | null | any
  contactFormTitle?: string | null
  contactFormSubtitle?: string | null
  postsContactForm?: FormType | string | null | any
  postsContactFormTitle?: string | null
  postsContactFormSubtitle?: string | null
  locale: string
}

export function FooterWrapper({
  contactForm,
  contactFormTitle,
  contactFormSubtitle,
  postsContactForm,
  postsContactFormTitle,
  postsContactFormSubtitle,
  locale,
}: FooterWrapperProps) {
  const pathname = usePathname()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPostPage, setIsPostPage] = useState(false)
  const [pageForm, setPageForm] = useState<any>(null)
  const [pageFormTitle, setPageFormTitle] = useState<string | null>(null)
  const [pageFormSubtitle, setPageFormSubtitle] = useState<string | null>(null)

  useEffect(() => {
    const checkPage = async () => {
      try {
        const postPage = pathname.includes('/posts/')

        if (postPage) {
          setIsPostPage(true)
          setShowForm(true)
          setLoading(false)
          return
        }

        // pathname is e.g. "/ro", "/ro/despre-noi", "/en/about"
        // First segment is always the locale, rest is the page path
        const pathParts = pathname.split('/').filter(Boolean)
        // Remove the locale prefix (first segment), then get the last segment as slug
        const pathWithoutLocale = pathParts.slice(1)
        const slug = pathWithoutLocale[pathWithoutLocale.length - 1] || 'home'

        const res = await fetch(
          `/api/pages?where[slug][equals]=${slug}&locale=${locale}&depth=2&limit=1`,
        )
        const data = await res.json()
        const page = data.docs?.[0]

        setShowForm(page?.showFooterContactForm || false)

        // Use page-specific form if available
        if (page?.footerForm && typeof page.footerForm === 'object') {
          setPageForm(page.footerForm)
        }
        if (page?.footerFormTitle) {
          setPageFormTitle(page.footerFormTitle)
        }
        if (page?.footerFormSubtitle) {
          setPageFormSubtitle(page.footerFormSubtitle)
        }
      } catch (error) {
        console.error('Error checking page:', error)
        setShowForm(false)
      } finally {
        setLoading(false)
      }
    }

    checkPage()
  }, [pathname, locale])

  // Determine which form to use based on context
  let activeForm: any
  let activeTitle: string | null | undefined
  let activeSubtitle: string | null | undefined

  if (isPostPage) {
    // For posts: use posts-specific form, fallback to global
    activeForm = postsContactForm && typeof postsContactForm === 'object'
      ? postsContactForm
      : contactForm
    activeTitle = postsContactFormTitle || contactFormTitle
    activeSubtitle = postsContactFormSubtitle || contactFormSubtitle
  } else {
    // For pages: use page-specific form, fallback to global
    activeForm = pageForm || contactForm
    activeTitle = pageFormTitle || contactFormTitle
    activeSubtitle = pageFormSubtitle || contactFormSubtitle
  }

  if (loading || !showForm || !activeForm || typeof activeForm === 'string') {
    return null
  }

  return (
    <FormBlock
      form={activeForm as any}
      enableIntro={false}
      title={activeTitle || undefined}
      subtitle={activeSubtitle || undefined}
    />
  )
}
