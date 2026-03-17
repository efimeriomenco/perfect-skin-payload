import type { PayloadHandler } from 'payload'
import { isAmoCRMConfigured } from '@/utilities/amocrm'

/**
 * GET /api/amocrm-status
 *
 * Check if AmoCRM integration is configured.
 */
export const amocrmStatusHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json(
      { error: 'Authentication required.' },
      { status: 401 },
    )
  }

  return Response.json({
    configured: isAmoCRMConfigured(),
    subdomain: process.env.AMOCRM_SUBDOMAIN || '(not set)',
    hasLongLivedToken: !!process.env.AMOCRM_LONG_LIVED_TOKEN,
  })
}
