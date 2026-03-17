import { cn } from '@/utilities/ui'
import React from 'react'

import type { Post } from '@/payload-types'

import { Card } from '@/components/Card'

export type Props = {
  posts: Post[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <Card className="h-full bg-white rounded-xs!" doc={result} relationTo="posts" showCategories key={index} />
          }

          return null
        })}
      </div>
    </div>
  )
}
