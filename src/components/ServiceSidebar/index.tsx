'use client'

import React, { useRef, useState } from 'react'
import { CMSLink } from '@/components/Link'
import type { Page } from '@/payload-types'

type SidebarProps = {
  contactTitle?: string | null
  contactItems?: Page['sidebarContactItems']
  buttons?: Page['sidebarButtons']
  media?: Page['sidebarMedia']
}

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const iconMap = {
  email: EmailIcon,
  location: LocationIcon,
  phone: PhoneIcon,
}

/** Auto-prepend mailto:/tel: based on contact type so the CMS user doesn't have to */
function resolveHref(type: string, href: string): string {
  if (type === 'email' && !href.startsWith('mailto:')) return `mailto:${href}`
  if (type === 'phone' && !href.startsWith('tel:')) return `tel:${href}`
  return href
}

const SidebarVideo: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div
      className="relative group block aspect-4/5 overflow-hidden rounded-2xl cursor-pointer bg-[#F0F0F0]"
      onClick={handlePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        muted
        poster=""
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-1"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export const ServiceSidebar: React.FC<SidebarProps> = ({
  contactTitle,
  contactItems,
  buttons,
  media,
}) => {
  return (
    <div className="space-y-6 my-16">
      {/* Contact Card */}
      <div className="rounded-2xl border border-[#E5E0DA] bg-white p-6 shadow-sm">
        {contactTitle && (
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-6 font-urbanist">
            {contactTitle}
          </h3>
        )}

        {/* Contact Items */}
        {contactItems && contactItems.length > 0 && (
          <div className="space-y-5">
            {contactItems.map((item, index) => {
              const contactType = item.type
              const Icon = iconMap[contactType as keyof typeof iconMap] || EmailIcon

              return (
                <div key={item.id || index} className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full border border-[#E5E0DA] flex items-center justify-center text-[#2C2C2C]">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C2C2C] font-urbanist">
                      {item.title}
                    </p>
                    {item.lines && item.lines.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {item.lines.map((line, lineIndex) => {
                          const fullHref = resolveHref(contactType, line.href)
                          return (
                            <a
                              key={line.id || lineIndex}
                              href={fullHref}
                              target={fullHref.startsWith('http') ? '_blank' : undefined}
                              rel={fullHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="block text-xs text-[#6B6B6B] font-work-sans hover:text-[#2C2C2C] transition-colors"
                            >
                              {line.label}
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Buttons — always filled #3F3F3F */}
        {buttons && buttons.length > 0 && (
          <div className="mt-6 space-y-3">
            {buttons.map((btn, index) => (
              <CMSLink
                key={btn.id || index}
                {...(btn.link as any)}
                label={null}
                appearance="inline"
                className="block"
              >
                <span
                  className="w-full flex items-center justify-center px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold font-work-sans rounded-md transition-all duration-200 bg-[#3F3F3F] text-white hover:bg-[#2C2C2C]"
                >
                  {(btn.link as any)?.label}
                </span>
              </CMSLink>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Videos */}
      {media && media.length > 0 && (
        <div className="space-y-4">
          {media.map((item, index) => {
            const video = item.video
            const videoUrl =
              video && typeof video !== 'string' && typeof video !== 'number'
                ? (video as any)?.url
                : null

            if (!videoUrl) return null

            return (
              <SidebarVideo key={item.id || index} videoUrl={videoUrl} />
            )
          })}
        </div>
      )}
    </div>
  )
}
