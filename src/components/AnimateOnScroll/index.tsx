'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

type Animation = 'fadeInUp' | 'fadeIn' | 'fadeInLeft' | 'fadeInRight'

interface Props {
  children: React.ReactNode
  className?: string
  animation?: Animation
  /** Delay in ms before the animation starts once in view */
  delay?: number
  /** How much of the element must be visible to trigger (0-1) */
  threshold?: number
  /** Only animate once (default true) */
  once?: boolean
}

const animationStyles: Record<Animation, { initial: string; animate: string }> = {
  fadeInUp: {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
  },
  fadeIn: {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  fadeInLeft: {
    initial: 'opacity-0 -translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
  fadeInRight: {
    initial: 'opacity-0 translate-x-8',
    animate: 'opacity-100 translate-x-0',
  },
}

export const AnimateOnScroll: React.FC<Props> = ({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.15,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, once])

  const { initial, animate } = animationStyles[animation]

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? animate : initial,
        className,
      )}
    >
      {children}
    </div>
  )
}
