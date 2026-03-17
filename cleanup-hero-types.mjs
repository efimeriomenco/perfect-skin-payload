/**
 * Cleanup script for old hero types
 * Run with: node cleanup-hero-types.mjs
 * 
 * This script will update old hero type values to the new ones
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  const envFile = readFileSync(join(__dirname, '.env'), 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
} catch (error) {
  console.log('Note: Could not load .env file, using existing environment variables')
}

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
})

// Mapping old hero types to new ones
const heroTypeMapping = {
  'lowImpact': 'default',
  'highImpact': 'withImage',
  'mediumImpact': 'withImage',
  'none': null, // Will be set to 'default' instead
}

async function cleanupHeroTypes() {
  const client = await pool.connect()
  
  try {
    console.log('🔍 Starting cleanup of old hero types...\n')
    
    // Update pages table
    try {
      for (const [oldType, newType] of Object.entries(heroTypeMapping)) {
        if (newType === null) {
          // Set 'none' to 'default'
          const result = await client.query(
            `UPDATE "pages" SET "hero_type" = $1::text WHERE "hero_type" = $2::text`,
            ['default', oldType]
          )
          if (result.rowCount > 0) {
            console.log(`  ✅ Updated ${result.rowCount} page(s) from "${oldType}" to "default"`)
          }
        } else {
          const result = await client.query(
            `UPDATE "pages" SET "hero_type" = $1::text WHERE "hero_type" = $2::text`,
            [newType, oldType]
          )
          if (result.rowCount > 0) {
            console.log(`  ✅ Updated ${result.rowCount} page(s) from "${oldType}" to "${newType}"`)
          }
        }
      }
    } catch (error) {
      console.error(`  ❌ Error updating pages:`, error.message)
    }

    // Update pages versions table
    try {
      for (const [oldType, newType] of Object.entries(heroTypeMapping)) {
        if (newType === null) {
          const result = await client.query(
            `UPDATE "_pages_v" SET "version_hero_type" = $1::text WHERE "version_hero_type" = $2::text`,
            ['default', oldType]
          )
          if (result.rowCount > 0) {
            console.log(`  ✅ Updated ${result.rowCount} page version(s) from "${oldType}" to "default"`)
          }
        } else {
          const result = await client.query(
            `UPDATE "_pages_v" SET "version_hero_type" = $1::text WHERE "version_hero_type" = $2::text`,
            [newType, oldType]
          )
          if (result.rowCount > 0) {
            console.log(`  ✅ Updated ${result.rowCount} page version(s) from "${oldType}" to "${newType}"`)
          }
        }
      }
    } catch (error) {
      console.error(`  ❌ Error updating page versions:`, error.message)
    }
    
    console.log('\n✅ Cleanup completed!')
    console.log('\n📝 Next steps:')
    console.log('   1. Restart your PayloadCMS application')
    console.log('   2. The enum type will be updated automatically')
    console.log('   3. The errors should be resolved\n')
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
    if (error.message.includes('DATABASE_URL')) {
      console.error('\n💡 Make sure your .env file has DATABASE_URL set')
    }
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

cleanupHeroTypes()
