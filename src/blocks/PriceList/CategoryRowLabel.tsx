'use client'

import { useRowLabel } from '@payloadcms/ui'

const CategoryRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    categoryName?: string
  }>()

  const number = (rowNumber ?? 0) + 1
  const name = data?.categoryName?.trim()

  return <span>{name ? `Category ${number}: ${name}` : `Category ${number}`}</span>
}

export default CategoryRowLabel
