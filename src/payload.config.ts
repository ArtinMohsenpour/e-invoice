import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

// import { Invoices } from './collections/Invoices' // Uncomment this once you create the file

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  email: resendAdapter({
    defaultFromAddress: 'mohsenpour.artin@gmail.com',
    defaultFromName: 'Faktura',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  // Register your collections here
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // Ensure your .env has DATABASE_URL set to your Supabase string
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})
