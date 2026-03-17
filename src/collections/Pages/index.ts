import type { CollectionConfig, TypedLocale } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { PriceList } from '../../blocks/PriceList/config'
import { Team } from '../../blocks/Team/config'
import { AboutUs } from '../../blocks/AboutUs/config'
import { FollowUs } from '../../blocks/FollowUs/config'
import { ClientReviews } from '../../blocks/ClientReviews/config'
import { hero } from '@/heros/config'
import { link } from '@/fields/link'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          locale: locale.code,
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, { locale }) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        locale,
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      localized: true,
      type: 'text',
      required: true,
    },
    {
      name: 'layoutType',
      type: 'select',
      defaultValue: 'fullWidth',
      label: 'Page Layout',
      options: [
        { label: 'Full Width', value: 'fullWidth' },
        { label: 'With Sidebar (Service Page)', value: 'withSidebar' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Choose page layout. "With Sidebar" adds a contact card and media on the right side.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              localized: true,
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, PriceList, Team, AboutUs, FollowUs, ClientReviews],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          label: 'Sidebar',
          fields: [
            {
              type: 'ui',
              name: 'sidebarInfo',
              admin: {
                condition: (data) => data?.layoutType !== 'withSidebar',
                components: {},
              },
            },
            {
              name: 'sidebarContactTitle',
              type: 'text',
              localized: true,
              label: 'Contact Section Title',
              defaultValue: 'Contactează-Ne',
              admin: {
                condition: (data) => data?.layoutType === 'withSidebar',
              },
            },
            {
              name: 'sidebarContactItems',
              type: 'array',
              label: 'Contact Items',
              admin: {
                condition: (data) => data?.layoutType === 'withSidebar',
                description: 'Add contact items (email, address, phone, etc.)',
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: 'Type',
                  options: [
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Location', value: 'location' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Title',
                  admin: { description: 'e.g. "Chat To Us", "Call Us", "Visit our Office Branch"' },
                },
                {
                  name: 'lines',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  label: 'Contact Details',
                  labels: { singular: 'Line', plural: 'Lines' },
                  admin: {
                    description: 'Each line is a clickable entry. For Email just enter the address, for Phone just enter the number — prefixes are added automatically.',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Display Text',
                      admin: { description: 'What the user sees, e.g. "+1 502-240-6226" or "info@example.com"' },
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: 'Value',
                      admin: {
                        description: 'Email: info@example.com · Phone: +15022406226 · Location: full URL (https://maps.google.com/...)',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'sidebarButtons',
              type: 'array',
              label: 'Sidebar Buttons',
              maxRows: 3,
              admin: {
                condition: (data) => data?.layoutType === 'withSidebar',
              },
              fields: [
                link({ appearances: false }),
              ],
            },
            {
              name: 'sidebarMedia',
              type: 'array',
              label: 'Sidebar Videos',
              admin: {
                condition: (data) => data?.layoutType === 'withSidebar',
                description: 'Upload videos that appear below the contact card',
              },
              fields: [
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Video',
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'showFooterContactForm',
      type: 'checkbox',
      label: 'Show Contact Form in Footer',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Enable to display the contact form above the footer on this page',
      },
    },
    {
      name: 'footerForm',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Footer Form',
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.showFooterContactForm),
        description: 'Select a specific form for this page. If empty, the global footer form will be used.',
      },
    },
    {
      name: 'footerFormTitle',
      type: 'text',
      localized: true,
      label: 'Footer Form Title',
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.showFooterContactForm),
        description: 'Override the form title for this page. Leave empty to use the global title.',
      },
    },
    {
      name: 'footerFormSubtitle',
      type: 'text',
      localized: true,
      label: 'Footer Form Subtitle',
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.showFooterContactForm),
        description: 'Override the form subtitle for this page. Leave empty to use the global subtitle.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
}
