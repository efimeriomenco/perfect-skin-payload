'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename } = resource

    return (
      <video
        autoPlay
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          videoClassName,
        )}
        controls={false}
        loop
        muted
        onClick={onClick}
        onLoadedData={() => setIsLoaded(true)}
        playsInline
        preload="metadata"
        ref={videoRef}
      >
        <source src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}`} />
      </video>
    )
  }

  return null
}
