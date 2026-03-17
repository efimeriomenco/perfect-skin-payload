import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import Users from './collections/Users'
import { Members } from './collections/Members'
import { Reviews } from './collections/Reviews'
import { amocrmSetupHandler, amocrmStatusHandler } from './endpoints/amocrmSetup'
import { syncFormSubmissionToAmoCRM } from './hooks/syncAmoCRM'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from 'src/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import localization from './i18n/localization'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title}` : ''
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL!}/${doc.slug}`
    : process.env.NEXT_PUBLIC_SERVER_URL!
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
                validate: (value: any, options: any) => {
                  if (options?.siblingData?.linkType === 'internal') {
                    return true // no validation needed, as no url should exist for internal links
                  }
                  return value ? true : 'URL is required'
                },
              },
            ]
          },
        }),
      ]
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Members, Reviews],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  endpoints: [
    // AmoCRM integration setup - exchange auth code for tokens
    {
      handler: amocrmSetupHandler,
      method: 'post',
      path: '/amocrm-setup',
    },
    // AmoCRM integration status check
    {
      handler: amocrmStatusHandler,
      method: 'get',
      path: '/amocrm-status',
    },
  ],
  globals: [Header, Footer],
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
        // @ts-expect-error
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories'],
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                name: 'confirmationMessage',
                type: 'textarea',
                localized: true,
                required: false,
                label: 'Confirmation Message',
                admin: {
                  description: 'Message shown after successful form submission',
                },
              }
            }
            return field
          })
        },
      },
      formSubmissionOverrides: {
        hooks: {
          afterChange: [syncFormSubmissionToAmoCRM],
        },
      },
    }),
    searchPlugin({
      collections: ['posts'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    payloadCloudPlugin(),
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  localization,
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
