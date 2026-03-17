import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { CMSLink } from '../../components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText content={richText} enableGutter={false} className="font-urbanist" style={{ fontSize: 'clamp(0.938rem, 0.88rem + 0.31vw, 1.125rem)', lineHeight: '1.5' }} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
    </div>
  )
}
