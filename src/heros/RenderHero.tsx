import React from 'react'

import type { Page } from '@/payload-types'

import { WithImageHero } from '@/heros/WithImage'
import { TitleHero } from '@/heros/Title'

type RenderHeroProps = Page['hero'] & {
  pageTitle?: string | null
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type, pageTitle } = props || {}

  if (!type || (type as string) === 'none') return null

  if (type === 'title') {
    return <TitleHero pageTitle={pageTitle} />
  }

  if (type === 'withImage' || type === 'default') {
    return <WithImageHero {...props} />
  }

  return null
}
