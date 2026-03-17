import type { CollectionAfterChangeHook } from 'payload'
import { sendFormSubmissionToAmoCRM } from '@/utilities/amocrm'

/**
 * Payload CMS afterChange hook for the form-submissions collection.
 *
 * When a new form submission is created, this hook sends the data to AmoCRM
 * as a new lead with an embedded contact.
 */
export const syncFormSubmissionToAmoCRM: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only sync on creation of new submissions, not on updates
  if (operation !== 'create') return doc

  try {
    // Get the form title for the lead name
    let formTitle = 'Website Form'

    if (doc.form) {
      // doc.form can be an ID (string/number) or a populated form object
      if (typeof doc.form === 'object' && doc.form.title) {
        formTitle = doc.form.title
      } else if (typeof doc.form === 'string' || typeof doc.form === 'number') {
        // Try to fetch the form to get its title
        try {
          const form = await req.payload.findByID({
            collection: 'forms',
            id: doc.form,
          })
          if (form?.title) {
            formTitle = form.title
          }
        } catch {
          // If we can't fetch the form, use default title
        }
      }
    }

    // Extract submission data
    const submissionData =
      doc.submissionData?.map((item: { field: string; value: unknown }) => ({
        field: item.field || '',
        value: item.value || '',
      })) || []

    // Send to AmoCRM asynchronously (don't block the response)
    // Using void to explicitly fire-and-forget
    void sendFormSubmissionToAmoCRM(formTitle, submissionData)

    console.log(`[AmoCRM Hook] Queued form submission sync for: "${formTitle}"`)
  } catch (err) {
    // Log but don't throw - AmoCRM sync should never break form submissions
    console.error('[AmoCRM Hook] Error preparing form submission sync:', err)
  }

  return doc
}
