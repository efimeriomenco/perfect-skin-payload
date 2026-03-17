'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

type Props = Extract<Page['layout'][0], { blockType: 'priceList' }> & {
  id?: string
}

type ServiceType = {
  serviceName: string
  description?: string | null
  price: string
  image?: any
  id?: string | null
}

const MOBILE_INITIAL_COUNT = 5

const ServiceRow: React.FC<{ service: ServiceType; circular?: boolean }> = ({
  service,
  circular,
}) => (
  <div className="group flex items-center gap-3 md:gap-4 py-2.5 md:py-4 px-3 -mx-3 rounded-lg transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
    {/* Image / Placeholder — hidden on mobile for compact view */}
    <div
      className={`hidden md:block shrink-0 w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 ${circular ? 'rounded-full' : 'rounded-xs'}`}
      style={{ backgroundColor: '#F1C8A7' }}
    >
      {service.image && typeof service.image !== 'string' && (
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${service.image.url}`}
          alt={service.serviceName}
          width={64}
          height={64}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${circular ? 'rounded-full' : 'rounded-lg'}`}
        />
      )}
    </div>

    {/* Name + dots + price */}
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-1">
        <span className="text-base lg:text-lg xl:text-xl font-semibold text-[#2C2C2C] font-urbanist whitespace-nowrap transition-colors duration-200 group-hover:text-[#C8A97E]">
          {service.serviceName}
        </span>
        <span className="flex-1 border-b border-dotted border-[#D4C4B4] mx-1 md:mx-2 translate-y-[-4px]" />
        <span className="text-base md:text-xl font-semibold text-[#2C2C2C] font-urbanist whitespace-nowrap">
          {service.price}
        </span>
      </div>
      {service.description && (
        <p className="text-sm xl:text-base text-[#7A7A7A] mt-0.5 md:mt-1 font-work-sans leading-relaxed">{service.description}</p>
      )}
    </div>
  </div>
)

const ServiceList: React.FC<{
  services: ServiceType[]
  circular?: boolean
}> = ({ services, circular }) => {
  const [expanded, setExpanded] = useState(false)
  const hasMore = services.length > MOBILE_INITIAL_COUNT

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 md:gap-y-1">
        {services.map((service, idx) => (
          <div
            key={service.id || idx}
            className={
              !expanded && hasMore && idx >= MOBILE_INITIAL_COUNT
                ? 'hidden md:block'
                : undefined
            }
          >
            <ServiceRow service={service} circular={circular} />
          </div>
        ))}
      </div>

      {/* Show more / less toggle — mobile only */}
      {hasMore && (
        <div className="md:hidden flex justify-center mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer flex items-center gap-1.5 text-sm font-semibold text-[#3F3F3F] font-work-sans tracking-wide transition-colors duration-200 hover:text-[#C8A97E] py-2 px-4"
          >
            {expanded
              ? 'Arată mai puțin'
              : `Arată toate (${services.length})`}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      )}
    </>
  )
}

export const PriceListBlock: React.FC<Props> = (props) => {
  const { title, womanTitle, menTitle, categories } = props
  const [activeTab, setActiveTab] = useState(0)

  if (!categories || categories.length === 0) return null

  const activeCategory = categories[activeTab]

  return (
    <section>
      {/* ——— Woman Section ——— */}
      <div className="mb-20">
        <div className="container">
          {womanTitle && (
            <h3 className="text-2xl md:text-5xl font-medium text-[#2C2C2C] mb-8 font-urbanist text-center">
              {womanTitle}
            </h3>
          )}

          {/* Woman Tabs — rectangular */}
          <div className="grid grid-cols-2 gap-3 mb-10 md:flex md:flex-wrap md:justify-center">
            {categories.map((cat, idx) => (
              <Button
                key={cat.id || idx}
                onClick={() => setActiveTab(idx)}
                className={`cursor-pointer flex items-center rounded-none! font-work-sans tracking-[25%] justify-start text-sm font-semibold transition-all duration-300 border text-left leading-tight hover:text-white hover:shadow-md w-full md:w-[200px] h-[60px] ${
                  activeTab === idx
                    ? 'bg-[#3F3F3F] text-white border-[#3F3F3F] shadow-md'
                    : 'bg-white text-[#3F3F3F] border-[#E5E5E5] hover:border-[#3F3F3F] hover:bg-[#3F3F3F]'
                }`}
              >
                <span className="flex flex-col">
                  {cat.categoryName.split(' ').map((word, i) => (
                    <span key={i}>{word}</span>
                  ))}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Woman Services — full-width bg, contained content */}
        <div
          className="py-8 md:py-12 transition-colors duration-300"
          style={{ backgroundColor: '#FFF8F3' }}
        >
          <div className="container">
            {activeCategory?.womanServices && activeCategory.womanServices.length > 0 ? (
              <ServiceList services={activeCategory.womanServices as ServiceType[]} />
            ) : (
              <p className="text-sm text-[#7A7A7A] text-center py-8">No services available</p>
            )}
          </div>
        </div>
      </div>

      {/* ——— Men Section ——— */}
      <div>
        <div className="container">
          {menTitle && (
            <h3 className="text-2xl md:text-5xl font-medium text-[#2C2C2C] mb-8 font-urbanist text-center">
              {menTitle}
            </h3>
          )}

          {/* Men Tabs — circular image thumbnails */}
          <div className="flex gap-4 lg:gap-12 xl:gap-18 mb-20 md:flex-wrap justify-start md:justify-center overflow-x-auto md:overflow-visible py-4 md:py-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat, idx) => (
              <button
                key={cat.id || idx}
                onClick={() => setActiveTab(idx)}
                className="cursor-pointer flex flex-col items-center gap-1.5 md:gap-1 text-xs md:text-sm font-semibold font-urbanist transition-all duration-300 group shrink-0"
              >
                <div
                  className={`shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] xl:w-[140px] xl:h-[140px] rounded-full overflow-hidden border-2 md:border-3 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 ${
                    activeTab === idx
                      ? 'border-[#B6A475] shadow-md md:shadow-[0_0_20px_rgba(200,169,126,0.3)] scale-105'
                      : 'border-transparent group-hover:border-[#B6A475]'
                  }`}
                >
                  {cat.categoryImage && typeof cat.categoryImage === 'object' ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${cat.categoryImage.url}`}
                      alt={cat.categoryName}
                      width={140}
                      height={140}
                      className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full bg-[#F4F2ED]"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Men Services — full-width bg, contained content */}
        <div
          className="py-8 md:py-12 transition-colors duration-300"
          style={{ backgroundColor: '#FFF8F3' }}
        >
          <div className="container">
            {activeCategory?.menServices && activeCategory.menServices.length > 0 ? (
              <ServiceList services={activeCategory.menServices as ServiceType[]} circular />
            ) : (
              <p className="text-sm text-[#7A7A7A] text-center py-8">No services available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
