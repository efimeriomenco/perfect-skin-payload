import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO & Open Graph',
          description: 'Configure how your site appears when shared on social media (Telegram, Facebook, Twitter, etc.)',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Site Name',
              defaultValue: 'Perfect Skin Moldova',
              admin: {
                description: 'The name of your website (shown in browser tabs and social shares)',
              },
            },
            {
              name: 'siteTitle',
              type: 'text',
              label: 'Default Page Title',
              localized: true,
              defaultValue: 'Perfect Skin Moldova - Epilare, Laser',
              admin: {
                description: 'Default title shown in search results and social shares when a page has no custom title',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
              localized: true,
              defaultValue: 'Perfect Skin Moldova este un centru de epilare ce oferă piele netedă, îngrijită și rezultate sigure, de durată.',
              admin: {
                description: 'Default description shown in search results and social shares (max 160 characters recommended)',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Open Graph Image',
              admin: {
                description: 'Default image shown when sharing links on social media. Recommended size: 1200x630px',
              },
            },
          ],
        },
      ],
    },
  ],
}
