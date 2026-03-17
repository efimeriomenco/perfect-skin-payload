'use client'

import React from 'react'
import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

import type { Page, Member } from '@/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'team' }> & {
  id?: string
}

export const TeamBlock: React.FC<Props> = (props) => {
  const { title, members } = props

  if (!members || members.length === 0) return null

  // members can be either IDs (number) or populated Member objects
  const populatedMembers = members.filter(
    (m): m is Member => typeof m === 'object' && m !== null,
  )

  if (populatedMembers.length === 0) return null

  return (
    <section>
      <div className="container">
        {/* Title */}
        <h2
          className="mb-10 text-center text-2xl md:text-3xl lg:text-5xl font-medium font-urbanist text-[#2C2C2C]"
        >
          {title}
        </h2>

        {/* Carousel */}
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className="w-full md:px-12"
        >
          <CarouselContent className="-ml-6">
            {populatedMembers.map((member, index) => (
              <CarouselItem
                key={member.id || index}
                className="pl-6 basis-[260px] md:basis-1/3 lg:basis-1/4"
              >
                {/* Photo */}
                <div className="group relative aspect-3/4 w-full overflow-hidden rounded-lg bg-[#F0F0F0] cursor-pointer">
                  {member.photo && typeof member.photo !== 'string' && typeof member.photo !== 'number' && (
                    <Media
                      resource={member.photo}
                      fill
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Overlay darkens on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Name & role overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/50 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg font-bold text-white font-urbanist">{member.name}</h3>
                    {member.role && (
                      <p className="text-sm text-white/80 font-urbanist">{member.role}</p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className="hidden md:flex -left-2 w-16 h-16 border-0 bg-transparent hover:bg-transparent text-[#2C2C2C]/40 hover:text-[#2C2C2C] [&_svg]:h-16! [&_svg]:w-16!"
          />
          <CarouselNext
            variant="ghost"
            className="hidden md:flex -right-2 w-16 h-16 border-0 bg-transparent hover:bg-transparent text-[#2C2C2C]/40 hover:text-[#2C2C2C] [&_svg]:h-16! [&_svg]:w-16!"
          />
        </Carousel>
      </div>
    </section>
  )
}
