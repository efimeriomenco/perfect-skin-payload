'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'followUs' }> & {
  id?: string
}

export const FollowUsBlock: React.FC<Props> = (props) => {
  const { title, posts } = props
  const [activePostKey, setActivePostKey] = useState<string | null>(null)

  if (!posts || posts.length === 0) return null

  return (
    <section className="md:pt-12">
      {/* Title */}
      <div className="container">
        <h2 className="mb-8 md:mb-10 text-center text-2xl md:text-3xl lg:text-5xl font-medium font-urbanist text-[#2C2C2C]">
          {title}
        </h2>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory">
        {posts.map((post, index) => (
          <div key={post.id || index} className="shrink-0 w-[65vw] snap-center">
            <PostCard
              post={post}
              postKey={String(post.id ?? index)}
              activePostKey={activePostKey}
              setActivePostKey={setActivePostKey}
            />
          </div>
        ))}
      </div>

      {/* Desktop: grid layout */}
      <div className="container hidden md:block">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post, index) => (
            <PostCard
              key={post.id || index}
              post={post}
              postKey={String(post.id ?? index)}
              activePostKey={activePostKey}
              setActivePostKey={setActivePostKey}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

type PostCardProps = {
  post: NonNullable<Props['posts']>[number]
  postKey: string
  activePostKey: string | null
  setActivePostKey: React.Dispatch<React.SetStateAction<string | null>>
}

const PostCard: React.FC<PostCardProps> = ({ post, postKey, activePostKey, setActivePostKey }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const videoUrl = post.video && typeof post.video !== 'string' ? (post.video as any)?.url : null

  // Append #t=0.001 to force Safari to load & render the first video frame
  const videoSrc = videoUrl ? `${videoUrl}#t=0.001` : null
  const isActive = useMemo(() => activePostKey === postKey, [activePostKey, postKey])

  useEffect(() => {
    if (!videoRef.current) return

    // If some other card becomes active, pause and reset this one.
    if (playing && !isActive) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setPlaying(false)
    }
  }, [isActive, playing])

  const handlePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
      if (isActive) setActivePostKey(null)
    } else {
      setActivePostKey(postKey)
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const handleToggleMute: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return

    const nextMuted = !muted
    videoRef.current.muted = nextMuted
    setMuted(nextMuted)
  }

  if (!videoSrc) return null

  return (
    <div
      className="relative group block aspect-3/4 overflow-hidden cursor-pointer bg-[#F0F0F0]"
      onClick={handlePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        preload="metadata"
        muted={muted}
      />

      {/* Play button overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute button (only while playing) */}
      {playing && (
        <button
          type="button"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          onClick={handleToggleMute}
          className="absolute right-3 bottom-3 z-10 inline-flex items-center justify-center rounded-full border border-white/60 bg-black/25 backdrop-blur-sm text-white transition hover:bg-black/35 w-10 h-10"
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M11 5L6 9H3v6h3l5 4V5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M16 9l5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M11 5L6 9H3v6h3l5 4V5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 8.5a5 5 0 0 1 0 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18.5 6a9 9 0 0 1 0 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
