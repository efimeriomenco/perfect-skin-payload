import React from 'react'

type TitleHeroProps = {
  pageTitle?: string | null
}

export const TitleHero: React.FC<TitleHeroProps> = ({ pageTitle }) => {
  if (!pageTitle) return null

  return (
    <div className="bg-[#F9D2B3E5]">
      <div className="container py-16 lg:py-33 flex justify-center items-center">
        <h1 className="text-2xl md:text-[40px] font-medium font-urbanist">{pageTitle}</h1>
      </div>
    </div>
  )
}
