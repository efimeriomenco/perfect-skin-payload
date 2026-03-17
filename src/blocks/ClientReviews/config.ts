import type { Block } from 'payload'

export const ClientReviews: Block = {
  slug: 'clientReviews',
  interfaceName: 'ClientReviewsBlock',
  labels: {
    plural: 'Client Reviews Blocks',
    singular: 'Client Reviews',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
      admin: {
        description: 'e.g. Ce spun clienții noștri',
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
      required: true,
      label: 'Reviews',
      admin: {
        description: 'Select reviews to display. You can reuse the same reviews across different blocks.',
      },
    },
  ],
}
