import { cn } from '@/utilities/ui'
import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PriceListBlock } from '@/blocks/PriceList/Component'
import { TeamBlock } from '@/blocks/Team/Component'
import { AboutUsBlock } from '@/blocks/AboutUs/Component'
import { FollowUsBlock } from '@/blocks/FollowUs/Component'
import { ClientReviewsBlock } from '@/blocks/ClientReviews/Component'
import { AnimateOnScroll } from '@/components/AnimateOnScroll'
import { TypedLocale } from 'payload'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  priceList: PriceListBlock,
  team: TeamBlock,
  aboutUs: AboutUsBlock,
  followUs: FollowUsBlock,
  clientReviews: ClientReviewsBlock,
}

/** Cycle through animation variants for visual variety */
const animations = ['fadeInUp', 'fadeIn', 'fadeInUp', 'fadeInUp'] as const

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale
  searchParams?: Record<string, string | string[] | undefined>
}> = (props) => {
  const { blocks, locale, searchParams } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // First block: render without animation so it's visible immediately
              if (index === 0) {
                return (
                  <div className="my-16" key={index}>
                    {/* @ts-expect-error */}
                    <Block {...block} locale={locale} searchParams={searchParams} />
                  </div>
                )
              }

              return (
                <AnimateOnScroll
                  key={index}
                  animation={animations[index % animations.length]}
                  className="my-16"
                >
                  {/* @ts-expect-error */}
                  <Block {...block} locale={locale} searchParams={searchParams} />
                </AnimateOnScroll>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
