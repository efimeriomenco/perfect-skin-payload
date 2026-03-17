'use client'
import { useRowLabel } from '@payloadcms/ui'

const NavItemRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    link?: {
      label?: string
      type?: string
      reference?: {
        relationTo?: string
        value?: {
          title?: string
        } | string
      }
      url?: string
    }
  }>()

  const label = data?.link?.label
  const linkType = data?.link?.type
  
  let displayLabel = label || `Item ${(rowNumber ?? 0) + 1}`
  
  // If no label but has a reference, try to show the page title
  if (!label && linkType === 'reference' && data?.link?.reference?.value) {
    const refValue = data.link.reference.value
    if (typeof refValue === 'object' && refValue.title) {
      displayLabel = refValue.title
    }
  }
  
  // If custom URL, show the URL if no label
  if (!label && linkType === 'custom' && data?.link?.url) {
    displayLabel = data.link.url
  }

  return <span>{displayLabel}</span>
}

export default NavItemRowLabel
