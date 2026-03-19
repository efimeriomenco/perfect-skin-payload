'use client'

import React from 'react'
import { Media } from '@/components/Media'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

import type { Page, Review } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = Extract<Page['layout'][0], { blockType: 'clientReviews' }> & {
  id?: string
}

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={star <= rating ? '#FFBC42' : '#E5E0DA'}
        className={cn("transition-transform duration-200 hover:scale-125", className)}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const ClientReviewsBlock: React.FC<Props> = (props) => {
  const { title, reviews } = props

  if (!reviews || reviews.length === 0) return null

  const populatedReviews = reviews.filter(
    (r): r is Review => typeof r === 'object' && r !== null,
  )

  if (populatedReviews.length === 0) return null

  return (
    <section className="md:pb-16 md:pt-12">
      <div className="container">
        <h2
          className="mb-10 text-center text-2xl md:text-3xl lg:text-5xl font-medium font-urbanist text-[#2C2C2C]"
        >
          {title}
        </h2>

        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
            loop: true,
          }}
          plugins={[
            Autoplay({ delay: 3000, stopOnInteraction: true }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-6 p-4 -m-4">
            {populatedReviews.map((review, index) => (
              <CarouselItem
                key={review.id || index}
                className="pl-6 basis-[340px] md:basis-[400px]"
              >
                <div className="group rounded-2xl border border-[#E5E0DA]/60 bg-white p-7 h-full transition-all duration-300 hover:shadow-lg hover:border-[#C8A97E]/30 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-[#F1C8A7] ring-2 ring-transparent transition-all duration-300 group-hover:ring-[#C8A97E]/40">
                      {review.avatar && typeof review.avatar !== 'string' && typeof review.avatar !== 'number' && (
                        <Media
                          resource={review.avatar}
                          imgClassName="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[#2C2C2C] font-urbanist transition-colors duration-200 group-hover:text-[#C8A97E]">
                      {review.clientName}
                    </span>
                  </div>

                  <p className="text-sm text-[#4A4A4A] leading-relaxed mb-5 font-work-sans line-clamp-4">
                    {review.review}
                  </p>

                  <div className="flex items-center justify-between pt-4">
                    {review.date && (
                      <span className="text-xs text-[#9A9A9A] font-work-sans">
                        {formatDate(review.date)}
                      </span>
                    )}
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 w-10 h-10 border-[#E5E0DA] hover:bg-[#C8A97E]/10 hover:border-[#C8A97E] transition-all duration-300" />
          <CarouselNext className="hidden md:flex -right-4 w-10 h-10 border-[#E5E0DA] hover:bg-[#C8A97E]/10 hover:border-[#C8A97E] transition-all duration-300" />
        </Carousel>
      </div>
    </section>
  )
}
