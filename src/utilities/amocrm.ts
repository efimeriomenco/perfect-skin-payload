import fs from 'fs'
import path from 'path'

// ─── Configuration ────────────────────────────────────────────────────────────
const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN || ''
const AMOCRM_CLIENT_ID = process.env.AMOCRM_CLIENT_ID || ''
const AMOCRM_CLIENT_SECRET = process.env.AMOCRM_CLIENT_SECRET || ''
const AMOCRM_REDIRECT_URI = process.env.AMOCRM_REDIRECT_URI || ''
const AMOCRM_USER_ID = process.env.AMOCRM_USER_ID
  ? parseInt(process.env.AMOCRM_USER_ID, 10)
  : 9343310 // Default to main user ID

const BASE_URL = `https://${AMOCRM_SUBDOMAIN}.amocrm.ru`
const TOKEN_FILE = path.resolve(process.cwd(), '.amocrm-tokens.json')

// ─── Types ────────────────────────────────────────────────────────────────────
interface AmoCRMTokens {
  access_token: string
  refresh_token: string
  expires_at: number // Unix timestamp in ms
}

interface AmoCRMCustomField {
  field_code?: string
  field_id?: number
  values: { value: string; enum_code?: string }[]
}

interface AmoCRMContact {
  first_name?: string
  last_name?: string
  name?: string
  custom_fields_values?: AmoCRMCustomField[]
}

interface AmoCRMLeadPayload {
  name: string
  price?: number
  pipeline_id?: number
  status_id?: number
  custom_fields_values?: AmoCRMCustomField[]
  _embedded?: {
    contacts?: AmoCRMContact[]
    tags?: { name: string }[]
  }
}

export interface FormSubmissionField {
  field: string
  value: string | boolean | number
}

// ─── Token management ─────────────────────────────────────────────────────────

/** In-memory token cache to avoid reading file on every request */
let cachedTokens: AmoCRMTokens | null = null

function readTokens(): AmoCRMTokens | null {
  if (cachedTokens && cachedTokens.expires_at > Date.now()) {
    return cachedTokens
  }

  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const raw = fs.readFileSync(TOKEN_FILE, 'utf-8')
      const tokens: AmoCRMTokens = JSON.parse(raw)
      cachedTokens = tokens
      return tokens
    }
  } catch (err) {
    console.error('[AmoCRM] Error reading tokens file:', err)
  }
  return null
}

function writeTokens(tokens: AmoCRMTokens): void {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf-8')
    cachedTokens = tokens
  } catch (err) {
    console.error('[AmoCRM] Error writing tokens file:', err)
  }
}

/**
 * Exchange authorization code for access + refresh tokens.
 * Call this once during initial setup.
 */
export async function exchangeAuthCode(authCode: string): Promise<AmoCRMTokens> {
  const response = await fetch(`${BASE_URL}/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: AMOCRM_CLIENT_ID,
      client_secret: AMOCRM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: AMOCRM_REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`[AmoCRM] Failed to exchange auth code: ${response.status} ${errorBody}`)
  }

  const data = await response.json()

  const tokens: AmoCRMTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  writeTokens(tokens)
  console.log('[AmoCRM] Successfully exchanged auth code for tokens')
  return tokens
}

/**
 * Refresh the access token using the stored refresh token.
 */
async function refreshAccessToken(): Promise<AmoCRMTokens> {
  const currentTokens = readTokens()
  if (!currentTokens?.refresh_token) {
    throw new Error(
      '[AmoCRM] No refresh token available. Run the initial setup first via /api/amocrm-setup',
    )
  }

  const response = await fetch(`${BASE_URL}/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: AMOCRM_CLIENT_ID,
      client_secret: AMOCRM_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: currentTokens.refresh_token,
      redirect_uri: AMOCRM_REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`[AmoCRM] Failed to refresh token: ${response.status} ${errorBody}`)
  }

  const data = await response.json()

  const tokens: AmoCRMTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  writeTokens(tokens)
  console.log('[AmoCRM] Successfully refreshed access token')
  return tokens
}

/**
 * Get a valid access token, refreshing if necessary.
 */
async function getValidAccessToken(): Promise<string> {
  let tokens = readTokens()

  if (!tokens) {
    throw new Error(
      '[AmoCRM] No tokens found. Run the initial setup first via /api/amocrm-setup',
    )
  }

  // Refresh if token expires within the next 5 minutes
  if (tokens.expires_at < Date.now() + 5 * 60 * 1000) {
    // Only try to refresh if we have a refresh token
    if (tokens.refresh_token) {
      tokens = await refreshAccessToken()
    } else {
      console.warn('[AmoCRM] Token expired and no refresh token available. Using expired token — it may fail.')
    }
  }

  return tokens.access_token
}

// ─── API requests ─────────────────────────────────────────────────────────────

/**
 * Make an authenticated request to the AmoCRM API.
 */
async function amoCRMRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = await getValidAccessToken()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  // If unauthorized, try refreshing token once and retry
  if (response.status === 401) {
    console.log('[AmoCRM] Got 401, attempting token refresh...')
    const newTokens = await refreshAccessToken()

    const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newTokens.access_token}`,
        ...options.headers,
      },
    })

    if (!retryResponse.ok) {
      const errorBody = await retryResponse.text()
      throw new Error(
        `[AmoCRM] API request failed after token refresh: ${retryResponse.status} ${errorBody}`,
      )
    }

    return retryResponse.json() as Promise<T>
  }

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`[AmoCRM] API request failed: ${response.status} ${errorBody}`)
  }

  return response.json() as Promise<T>
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Create a lead with an embedded contact in AmoCRM.
 * This is the main function used to send form submission data.
 */
export async function createLeadWithContact(options: {
  leadName: string
  contactName?: string
  phone?: string
  email?: string
  message?: string
  pipelineId?: number
  statusId?: number
  customLeadFields?: AmoCRMCustomField[]
  tags?: string[]
}): Promise<unknown> {
  const { leadName, contactName, phone, email, message, pipelineId, statusId, customLeadFields, tags } =
    options

  // Build contact custom fields
  const contactCustomFields: AmoCRMCustomField[] = []

  if (phone) {
    contactCustomFields.push({
      field_code: 'PHONE',
      values: [{ value: phone, enum_code: 'MOB' }],
    })
  }

  if (email) {
    contactCustomFields.push({
      field_code: 'EMAIL',
      values: [{ value: email, enum_code: 'WORK' }],
    })
  }

  // --- Step 1: Create the contact first ---
  const contactPayload = [
    {
      name: contactName || leadName,
      ...(contactCustomFields.length > 0 && {
        custom_fields_values: contactCustomFields,
      }),
    },
  ]

  let contactId: number | undefined
  try {
    const contactResult = await amoCRMRequest('/api/v4/contacts', {
      method: 'POST',
      body: JSON.stringify(contactPayload),
    })
    contactId = (contactResult as any)?._embedded?.contacts?.[0]?.id
    console.log('[AmoCRM] Created contact:', contactId)
  } catch (contactErr) {
    console.error('[AmoCRM] Failed to create contact:', contactErr)
    // Continue without contact link
  }

  // --- Step 2: Create the lead (bypasses unsorted queue) ---
  const leadPayload = [
    {
      name: leadName,
      created_by: AMOCRM_USER_ID,
      ...(pipelineId && { pipeline_id: pipelineId }),
      ...(statusId && { status_id: statusId }),
      ...(customLeadFields && { custom_fields_values: customLeadFields }),
      _embedded: {
        ...(contactId && {
          contacts: [{ id: contactId }],
        }),
        ...(tags &&
          tags.length > 0 && {
            tags: tags.map((t) => ({ name: t })),
          }),
      },
    },
  ]

  const result = await amoCRMRequest('/api/v4/leads', {
    method: 'POST',
    body: JSON.stringify(leadPayload),
  })

  const leadId = (result as any)?._embedded?.leads?.[0]?.id
  console.log('[AmoCRM] Created lead:', leadId)

  // --- Step 3: Add a note with message if provided ---
  if (message && leadId) {
    try {
      await amoCRMRequest(`/api/v4/leads/${leadId}/notes`, {
        method: 'POST',
        body: JSON.stringify([
          {
            note_type: 'common',
            params: {
              text: message,
            },
          },
        ]),
      })
    } catch (noteErr) {
      console.error('[AmoCRM] Failed to add note to lead:', noteErr)
      // Don't fail the whole operation if note creation fails
    }
  }

  return result
}

/**
 * Check if AmoCRM integration is configured and has valid tokens.
 */
export function isAmoCRMConfigured(): boolean {
  if (!AMOCRM_SUBDOMAIN || !AMOCRM_CLIENT_ID || !AMOCRM_CLIENT_SECRET) {
    return false
  }
  const tokens = readTokens()
  return tokens !== null
}

/**
 * Map form submission fields to AmoCRM lead+contact data and create the lead.
 *
 * This function intelligently maps common form field names (name, email, phone,
 * message, etc.) to the appropriate AmoCRM fields.
 */
export async function sendFormSubmissionToAmoCRM(
  formTitle: string,
  submissionData: FormSubmissionField[],
): Promise<void> {
  if (!isAmoCRMConfigured()) {
    console.warn(
      '[AmoCRM] Integration not configured or no tokens. Skipping form submission sync.',
    )
    return
  }

  // Extract common fields from submission data
  let contactName = ''
  let phone = ''
  let email = ''
  let message = ''
  const otherFields: string[] = []

  for (const field of submissionData) {
    const fieldLower = field.field.toLowerCase()
    const value = String(field.value || '')

    if (!value) continue

    // Map field names intelligently
    if (
      fieldLower.includes('name') ||
      fieldLower.includes('имя') ||
      fieldLower.includes('nume')
    ) {
      contactName = contactName ? `${contactName} ${value}` : value
    } else if (
      fieldLower.includes('phone') ||
      fieldLower.includes('tel') ||
      fieldLower.includes('телефон') ||
      fieldLower.includes('telefon')
    ) {
      phone = value
    } else if (fieldLower.includes('email') || fieldLower.includes('почт')) {
      email = value
    } else if (
      fieldLower.includes('message') ||
      fieldLower.includes('comment') ||
      fieldLower.includes('сообщен') ||
      fieldLower.includes('коммент') ||
      fieldLower.includes('mesaj') ||
      fieldLower.includes('textarea')
    ) {
      message = value
    } else {
      otherFields.push(`${field.field}: ${value}`)
    }
  }

  // If there are unmapped fields, append them to the message
  if (otherFields.length > 0) {
    const additional = otherFields.join('\n')
    message = message
      ? `${message}\n\n--- Additional fields ---\n${additional}`
      : `--- Form fields ---\n${additional}`
  }

  // Pipeline "Clienți noi" → Stage "Leads WEBSITE"
  const pipelineId = process.env.AMOCRM_PIPELINE_ID
    ? parseInt(process.env.AMOCRM_PIPELINE_ID, 10)
    : 6547826
  const statusId = process.env.AMOCRM_STATUS_ID
    ? parseInt(process.env.AMOCRM_STATUS_ID, 10)
    : 84363154

  // Build a descriptive lead name:
  // "🌐 Ion Popescu — Solicită o consultanță" or "🌐 +37360123456 — Contact Form"
  const identifier = contactName || phone || email || 'Vizitator necunoscut'
  const leadName = `🌐 ${identifier} — ${formTitle || 'Formular site'}`

  try {
    await createLeadWithContact({
      leadName,
      contactName: contactName || phone || email || 'Vizitator site',
      phone,
      email,
      message,
      pipelineId,
      statusId,
      tags: ['website', formTitle || 'form'],
    })

    console.log(`[AmoCRM] Successfully created lead: "${leadName}"`)
  } catch (err) {
    console.error('[AmoCRM] Failed to create lead:', err)
    // Don't throw - we don't want AmoCRM errors to break form submissions
  }
}
