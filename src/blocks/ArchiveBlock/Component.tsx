import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { TypedLocale } from 'payload'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    locale: TypedLocale
    searchParams?: Record<string, string | string[] | undefined>
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    locale,
    searchParams,
  } = props

  const limit = limitFromProps || 6
  const currentPage = Number(searchParams?.page) || 1

  let posts: Post[] = []
  let totalDocs = 0
  let totalPages = 1
  let page = 1

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      locale,
      limit,
      page: currentPage,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
    totalDocs = fetchedPosts.totalDocs
    totalPages = fetchedPosts.totalPages
    page = fetchedPosts.page || 1
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
      totalDocs = posts.length
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />

      {populateBy === 'collection' && totalPages > 1 && (
        <div className="container">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
