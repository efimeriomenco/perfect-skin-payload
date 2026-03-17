import type { Block, Field } from 'payload'

import {
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  TextStateFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { fontSizeState, fontWeightState } from '@/fields/fontSizes'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          UnorderedListFeature(),
          OrderedListFeature(),
          ChecklistFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          TextStateFeature({
            state: { fontSize: fontSizeState, fontWeight: fontWeightState },
          }),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
