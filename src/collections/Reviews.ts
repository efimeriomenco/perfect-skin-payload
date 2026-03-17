import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['clientName', 'rating', 'date'],
    useAsTitle: 'clientName',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
    {
      name: 'review',
      type: 'textarea',
      required: true,
      localized: true,
      label: 'Review Text',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Rating (1–5)',
    },
  ],
}
