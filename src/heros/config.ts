import type { Field } from 'payload'

import { link } from '@/fields/link'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'withImage',
      label: 'Type',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'With Image',
          value: 'withImage',
        },
        {
          label: 'Title Only',
          value: 'title',
        },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        condition: (_, { type } = {}) => type === 'withImage' || type === 'default',
      },
    },
    {
      name: 'button',
      type: 'group',
      label: 'CTA Button',
      admin: {
        condition: (_, { type } = {}) => type === 'withImage' || type === 'default',
        description: 'Add a call-to-action button (e.g., "Schedule a call")',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Button Label',
          defaultValue: 'PROGRAMEAZĂ-TE',
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
    },
  ],
  label: false,
}
