import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'aboutUs' }> & {
  id?: string
}

export const AboutUsBlock: React.FC<Props> = (props) => {
  const {
    layout = 'imageLeft',
    variant = 'flat',
    image,
    subtitle,
    title,
    description,
    enableLink,
    link,
  } = props

  const isImageRight = layout === 'imageRight'
  const isCard = variant === 'card'

  const imageColumn = (
    <div className={cn(
      "relative w-full overflow-hidden max-h-[400px] lg:max-h-none",
      isCard ? "rounded-xl" : "rounded-tl-[60px] lg:rounded-tl-[120px] rounded-xl",
    )}>
      {image && typeof image !== 'string' && (
        <Media
          resource={image}
          imgClassName="w-full h-full object-cover"
        />
      )}
    </div>
  )

  const contentColumn = (
    <div className="flex flex-col justify-center">
      {subtitle && (
        <span className="text-base md:text-lg font-semibold text-[#2C2C2C] mb-1 font-urbanist">
          {subtitle}
        </span>
      )}

      {title && (
        <h2 className="text-xl md:text-3xl lg:text-[68px] font-bold text-[#2C2C2C] mb-3 md:mb-6 font-urbanist">
          {title}
        </h2>
      )}

      {description && (
        <RichText
          content={description}
          enableGutter={false}
          enableProse={false}
          className="text-sm md:text-base lg:text-xl leading-relaxed text-[#4A4A4A] space-y-3 md:space-y-4 font-work-sans [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#5C3A2E] [&_blockquote]:pl-4 [&_blockquote]:italic"
        />
      )}

      {enableLink && (
        <div className="mt-5 md:mt-8 flex justify-center md:justify-start">
          <CMSLink
            {...(link as any)}
            label={null}
            appearance="inline"
          >
            <span
              className="inline-flex items-center px-8 py-3 text-xs md:text-sm tracking-widest uppercase text-white transition-colors duration-200 hover:opacity-90 font-work-sans"
              style={{ backgroundColor: '#5C3A2E' }}
            >
              • {(link as any)?.label} –
            </span>
          </CMSLink>
        </div>
      )}
    </div>
  )

  const gridContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
      {isImageRight ? (
        <>
          {contentColumn}
          {imageColumn}
        </>
      ) : (
        <>
          {imageColumn}
          {contentColumn}
        </>
      )}
    </div>
  )

  if (isCard) {
    return (
      <section className="py-8 md:py-20">
        <div className="container bg-[#FFF8F3] rounded-2xl md:rounded-3xl p-5 md:p-12 lg:p-16">
          {gridContent}
        </div>
      </section>
    )
  }

  return (
    <section style={{ backgroundColor: '#FFF8F3' }} className="py-8 md:py-20">
      <div className="container">
        {gridContent}
      </div>
    </section>
  )
}
