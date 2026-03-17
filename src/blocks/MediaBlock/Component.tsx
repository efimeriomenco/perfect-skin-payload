import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    mediaOne,
    mediaTwo,
    position = 'default',
    richText,
    staticImage,
    disableInnerContainer,
  } = props as any

  let caption
  if (media && typeof media === 'object') caption = media.caption

  // Two images side by side
  if (position === 'twoImages') {
    return (
      <div className={cn('container', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaOne && typeof mediaOne === 'object' && (
            <div className="overflow-hidden rounded-xs">
              <Media
                resource={mediaOne}
                imgClassName="w-full h-full object-cover"
              />
            </div>
          )}
          {mediaTwo && typeof mediaTwo === 'object' && (
            <div className="overflow-hidden rounded-xs">
              <Media
                resource={mediaTwo}
                imgClassName="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  const isMediaText = position === 'mediaLeft' || position === 'mediaRight'

  if (isMediaText) {
    const isMediaRight = position === 'mediaRight'

    const mediaColumn = (
      <div className="relative w-full overflow-hidden rounded-xl">
        <Media
          imgClassName={cn('w-full h-full object-cover rounded-xl', imgClassName)}
          resource={media}
          src={staticImage}
        />
      </div>
    )

    const textColumn = (
      <div className="flex flex-col justify-start">
        {richText && (
          <RichText
            content={richText}
            enableGutter={false}
            enableProse={false}
            className="text-sm md:text-base leading-relaxed space-y-4 font-urbanist [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[#2C2C2C] [&_h2]:font-urbanist [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-[#2C2C2C] [&_h3]:font-urbanist [&_h3]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#2C2C2C] [&_h4]:font-urbanist [&_h4]:mb-2"
          />
        )}
      </div>
    )

    return (
      <div className={cn('container', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-start">
          {isMediaRight ? (
            <>
              {textColumn}
              {mediaColumn}
            </>
          ) : (
            <>
              {mediaColumn}
              {textColumn}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        '',
        {
          container: position === 'default' && enableGutter,
        },
        className,
      )}
    >
      {position === 'fullscreen' && (
        <div className="relative">
          <Media resource={media} src={staticImage} />
        </div>
      )}
      {position === 'default' && (
        <Media imgClassName={cn('rounded', imgClassName)} resource={media} src={staticImage} />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: position === 'fullscreen' && !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText content={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
