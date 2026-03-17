'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'

const { breakpoints } = cssVariables

// Tiny inline SVG shimmer used as blurDataURL so images don't pop in from blank space
const shimmerSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#e5e0da"/></svg>`
const shimmerBase64 = `data:image/svg+xml;base64,${typeof window === 'undefined' ? Buffer.from(shimmerSvg).toString('base64') : btoa(shimmerSvg)}`

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource

    src = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')

  return (
    <NextImage
      alt={alt || ''}
      className={cn(
        imgClassName,
        'transition-all duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
      )}
      fill={fill}
      height={!fill ? height : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      placeholder="blur"
      blurDataURL={shimmerBase64}
      priority={priority}
      quality={90}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
    />
  )
}
