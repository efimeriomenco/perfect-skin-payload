import type { Block } from 'payload'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    plural: 'Team Blocks',
    singular: 'Team',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
      admin: {
        description: 'e.g. Cunoaște Echipa Noastră',
      },
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'members',
      hasMany: true,
      required: true,
      label: 'Team Members',
      admin: {
        description: 'Select team members to display. You can reuse the same members across different Team blocks.',
      },
    },
  ],
}
