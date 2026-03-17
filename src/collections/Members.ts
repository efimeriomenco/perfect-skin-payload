import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Members: CollectionConfig = {
  slug: 'members',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'role', 'photo'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      label: 'Role / Position',
      admin: {
        description: 'e.g. Specialist epilare laser',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Photo',
    },
  ],
}
