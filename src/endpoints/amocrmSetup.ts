import type { PayloadHandler } from 'payload'
import { exchangeAuthCode, isAmoCRMConfigured } from '@/utilities/amocrm'

/**
 * POST /api/amocrm-setup
 *
 * One-time setup endpoint to exchange an AmoCRM authorization code for
 * access and refresh tokens.
 *
 * Body: { "code": "your_authorization_code_from_amocrm" }
 *
 * Steps to get the code:
 * 1. Go to your AmoCRM account → Settings → Integrations
 * 2. Create a new private integration (or open an existing one)
 * 3. Copy the Authorization Code (it's valid for 20 minutes!)
 * 4. POST it to this endpoint
 */
export const amocrmSetupHandler: PayloadHandler = async (req) => {
  // Only allow authenticated admin users to set up the integration
  if (!req.user) {
    return Response.json(
      { error: 'Authentication required. Log in to the admin panel first.' },
      { status: 401 },
    )
  }

  try {
    const body = await req.json?.()
    const code = body?.code

    if (!code) {
      return Response.json(
        {
          error: 'Missing "code" in request body.',
          instructions: [
            '1. Go to AmoCRM → Settings → Integrations',
            '2. Create/open your private integration',
            '3. Copy the Authorization Code (valid for 20 minutes)',
            '4. POST { "code": "YOUR_CODE" } to this endpoint',
          ],
          configured: isAmoCRMConfigured(),
        },
        { status: 400 },
      )
    }

    const tokens = await exchangeAuthCode(code)

    return Response.json({
      success: true,
      message: 'AmoCRM integration configured successfully!',
      expires_at: new Date(tokens.expires_at).toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[AmoCRM Setup]', message)

    return Response.json(
      { error: message },
      { status: 500 },
    )
  }
}

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
    hasClientId: !!process.env.AMOCRM_CLIENT_ID,
    hasClientSecret: !!process.env.AMOCRM_CLIENT_SECRET,
    hasRedirectUri: !!process.env.AMOCRM_REDIRECT_URI,
  })
}
