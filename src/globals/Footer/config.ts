import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
      ],
    },
    {
      name: 'column1',
      type: 'group',
      label: 'Column 1 - Navigation Links',
      admin: {
        description:
          'This column automatically displays all pages from the Pages collection. Manual links below are used as fallback if no pages exist.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Column Title',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
          defaultValue: [],
          admin: {
            description: 'Manual links (fallback only - pages are auto-populated)',
          },
        },
      ],
    },
    {
      name: 'column2',
      type: 'group',
      label: 'Column 2 - Contact Information',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Column Title',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
        },
      ],
    },
    {
      name: 'column3',
      type: 'group',
      label: 'Column 3 - Location',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Column Title',
        },
        {
          name: 'street',
          type: 'textarea',
          localized: true,
          label: 'Street Address',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
      ],
    },
    {
      name: 'contactUs',
      type: 'group',
      label: 'Contact Us Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Title',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'buttonText',
          type: 'text',
          localized: true,
          label: 'Button Text',
        },
      ],
    },
    {
      name: 'contactForm',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Footer Contact Form',
      admin: {
        description:
          'Select a form to display above the footer (will only show on pages where "Show Contact Form in Footer" is enabled)',
      },
    },
    {
      name: 'contactFormTitle',
      type: 'text',
      localized: true,
      label: 'Contact Form Title',
      admin: {
        description: 'e.g. Nu știți ce să alegeți?',
        condition: (data) => Boolean(data?.contactForm),
      },
    },
    {
      name: 'contactFormSubtitle',
      type: 'text',
      localized: true,
      label: 'Contact Form Subtitle',
      admin: {
        description: 'e.g. Lăsați datele și vă vom suna înapoi.',
        condition: (data) => Boolean(data?.contactForm),
      },
    },
    {
      name: 'postsContactForm',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Posts Footer Form',
      admin: {
        description:
          'Select a form to display in the footer on all blog post pages. If empty, the main contact form above will be used.',
      },
    },
    {
      name: 'postsContactFormTitle',
      type: 'text',
      localized: true,
      label: 'Posts Form Title',
      admin: {
        description: 'Title for the form on post pages',
        condition: (data) => Boolean(data?.postsContactForm),
      },
    },
    {
      name: 'postsContactFormSubtitle',
      type: 'text',
      localized: true,
      label: 'Posts Form Subtitle',
      admin: {
        description: 'Subtitle for the form on post pages',
        condition: (data) => Boolean(data?.postsContactForm),
      },
    },
    {
      name: 'copyright',
      type: 'group',
      label: 'Copyright & Legal Section',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          localized: true,
          label: 'Copyright Text',
          defaultValue: '© 2026 Perfect Skin. All rights reserved.',
        },
        {
          name: 'legalLinks',
          type: 'array',
          label: 'Legal Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
          defaultValue: [],
          admin: {
            description: 'Links to Privacy Policy, Terms of Service, etc.',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      defaultValue: [],
      admin: {
        description: 'Legacy navigation items (deprecated - use columns instead)',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
