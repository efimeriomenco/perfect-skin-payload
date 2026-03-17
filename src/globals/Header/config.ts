import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Logo',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              required: false,
            },
          ],
        },
        {
          label: 'Nav Items',
          fields: [
            {
              name: 'menuLabel',
              type: 'text',
              label: 'Menu Label',
              localized: true,
              defaultValue: 'Meniu',
              admin: {
                description: 'The text displayed on the menu button (e.g., "Meniu", "Menu")',
              },
            },
            {
              name: 'navItems',
              type: 'array',
              label: 'Navigation Menu Items',
              defaultValue: [],
              admin: {
                description:
                  'Add navigation items with optional submenu items.',
                initCollapsed: false,
                components: {
                  RowLabel: '@/globals/Header/NavItemRowLabel',
                },
              },
              fields: [
                link({
                  appearances: false,
                  disableLabel: false,
                }),
                {
                  name: 'subItems',
                  type: 'array',
                  label: 'Sub Menu Items (Dropdown)',
                  admin: {
                    description:
                      'Add submenu items that appear in a dropdown.',
                    initCollapsed: true,
                    components: {
                      RowLabel: '@/globals/Header/NavItemRowLabel',
                    },
                  },
                  fields: [
                    link({
                      appearances: false,
                      disableLabel: false,
                    }),
                  ],
                },
              ],
              maxRows: 15,
            },
          ],
        },
        {
          label: 'CTA Button',
          fields: [
            {
              name: 'ctaButton',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  label: 'Button Label',
                  required: true,
                },
                link({
                  appearances: false,
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
