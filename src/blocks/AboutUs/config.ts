import type { Block } from 'payload'

import {
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const AboutUs: Block = {
  slug: 'aboutUs',
  interfaceName: 'AboutUsBlock',
  labels: {
    plural: 'About Us Blocks',
    singular: 'About Us',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'imageLeft',
      label: 'Layout',
      options: [
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Image Right', value: 'imageRight' },
      ],
      admin: {
        description: 'Choose whether the image appears on the left or right side',
      },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'flat',
      label: 'Style Variant',
      options: [
        { label: 'Flat (plain background)', value: 'flat' },
        { label: 'Card (white card on beige background)', value: 'card' },
      ],
      admin: {
        description: 'Card: content inside a rounded white card on beige bg. Flat: plain layout.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Subtitle',
      admin: {
        description: 'e.g. Despre Noi',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
      admin: {
        description: 'e.g. Perfect Skin Moldova',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
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
            BlockquoteFeature(),
            IndentFeature(),
            LinkFeature(),
            HorizontalRuleFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Enable Button / Link',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_: any, siblingData: any) => siblingData?.enableLink,
        },
      },
    }),
  ],
}
