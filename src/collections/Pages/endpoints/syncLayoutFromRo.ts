import type { PayloadHandler } from 'payload'

const TARGET_LOCALES = ['ru', 'en'] as const

const stripIdsDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripIdsDeep)
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => [key, stripIdsDeep(val)] as const)

    return Object.fromEntries(entries)
  }

  return value
}

const getBlockType = (block: unknown): string | null => {
  if (!block || typeof block !== 'object') return null
  const value = (block as { blockType?: unknown }).blockType
  return typeof value === 'string' ? value : null
}

const getOccurrenceIndex = (layout: unknown[], index: number, blockType: string): number => {
  let count = 0
  for (let i = 0; i <= index; i++) {
    if (getBlockType(layout[i]) === blockType) count++
  }
  return count
}

const countTypeInLayout = (layout: unknown[], blockType: string): number => {
  let count = 0
  for (const block of layout) {
    if (getBlockType(block) === blockType) count++
  }
  return count
}

export const syncLayoutFromRoHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const pageIdFromParams = (req as { routeParams?: { id?: string } }).routeParams?.id
  const pageId = pageIdFromParams || ''
  if (!pageId) {
    return Response.json({ error: 'Missing page id.' }, { status: 400 })
  }

  const roDoc = await req.payload.findByID({
    collection: 'pages',
    id: pageId,
    locale: 'ro',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })

  const sourceLayout = Array.isArray(roDoc?.layout) ? roDoc.layout : []
  if (sourceLayout.length === 0) {
    return Response.json({ ok: true, updatedLocales: [], message: 'RO layout is empty.' })
  }

  const updatedLocales: string[] = []

  for (const locale of TARGET_LOCALES) {
    const localizedDoc = await req.payload.findByID({
      collection: 'pages',
      id: pageId,
      locale,
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })

    const targetLayout = Array.isArray(localizedDoc?.layout) ? localizedDoc.layout : []

    const missingBlocks = sourceLayout.filter((sourceBlock, index) => {
      const sourceType = getBlockType(sourceBlock)
      if (!sourceType) return false

      const sourceOccurrence = getOccurrenceIndex(sourceLayout, index, sourceType)
      const targetCount = countTypeInLayout(targetLayout, sourceType)
      return targetCount < sourceOccurrence
    })

    if (missingBlocks.length === 0) continue

    const missingBlocksWithoutIds = stripIdsDeep(missingBlocks) as unknown[]

    await req.payload.update({
      collection: 'pages',
      id: pageId,
      locale,
      depth: 0,
      overrideAccess: true,
      draft: true,
      data: {
        layout: [...targetLayout, ...missingBlocksWithoutIds] as any,
      },
    })

    updatedLocales.push(locale)
  }

  return Response.json({ ok: true, updatedLocales })
}
