import type { Block, Field } from 'payload'

const serviceFields: Field[] = [
  {
    name: 'serviceName',
    type: 'text',
    required: true,
    label: 'Service Name',
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'price',
    type: 'text',
    required: true,
    label: 'Price',
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    label: 'Service Image',
  },
]

export const PriceList: Block = {
  slug: 'priceList',
  interfaceName: 'PriceListBlock',
  labels: {
    plural: 'Price List Blocks',
    singular: 'Price List',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Block Title',
    },
    {
      name: 'womanTitle',
      type: 'text',
      required: true,
      localized: true,
      label: 'Woman Section Title',
      defaultValue: 'Epilare Pentru Femei',
    },
    {
      name: 'menTitle',
      type: 'text',
      required: true,
      localized: true,
      label: 'Men Section Title',
      defaultValue: 'Epilare Pentru Bărbați',
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Category',
        plural: 'Categories',
      },
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
          label: 'Category Name',
        },
        {
          name: 'categoryImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Category Image (for Men tabs)',
        },
        {
          name: 'womanServices',
          type: 'array',
          label: 'Woman Services',
          labels: {
            singular: 'Service',
            plural: 'Services',
          },
          fields: serviceFields,
        },
        {
          name: 'menServices',
          type: 'array',
          label: 'Men Services',
          labels: {
            singular: 'Service',
            plural: 'Services',
          },
          fields: serviceFields,
        },
      ],
    },
  ],
}
