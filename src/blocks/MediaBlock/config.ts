import type { Block } from 'payload'

import {
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  IndentFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { fontSizeState, fontWeightState } from '@/fields/fontSizes'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
        {
          label: 'Media Left — Text Right',
          value: 'mediaLeft',
        },
        {
          label: 'Media Right — Text Left',
          value: 'mediaRight',
        },
        {
          label: 'Two Images Side by Side',
          value: 'twoImages',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.position !== 'twoImages',
      },
    },
    {
      name: 'mediaOne',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image 1 (Left)',
      admin: {
        condition: (_, siblingData) => siblingData?.position === 'twoImages',
      },
    },
    {
      name: 'mediaTwo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image 2 (Right)',
      admin: {
        condition: (_, siblingData) => siblingData?.position === 'twoImages',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      label: 'Text Content',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.position === 'mediaLeft' || siblingData?.position === 'mediaRight',
        description: 'Text displayed alongside the media',
      },
      editor: lexicalEditor({
        features: () => {
          return [
            BoldFeature(),
            ItalicFeature(),
            UnderlineFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            UnorderedListFeature(),
            OrderedListFeature(),
            ChecklistFeature(),
            IndentFeature(),
            LinkFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            TextStateFeature({
              state: { fontSize: fontSizeState, fontWeight: fontWeightState },
            }),
          ]
        },
      }),
    },
  ],
}
