import { cn } from '@/utilities/ui'
import React from 'react'

import { serializeLexical } from './serialize'

type Props = {
  className?: string
  content: Record<string, any>
  enableGutter?: boolean
  enableProse?: boolean
  style?: React.CSSProperties
}

const RichText: React.FC<Props> = ({
  className,
  content,
  enableGutter = true,
  enableProse = true,
  style,
}) => {
  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose text-black! font-urbanist!': enableProse,
        },
        className,
      )}
      style={style}
    >
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  )
}

export default RichText
