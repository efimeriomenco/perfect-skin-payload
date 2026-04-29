'use client'

import React, { useState } from 'react'
import { toast, useDocumentInfo } from '@payloadcms/ui'

type SyncErrorResponse = {
  errors?: Array<{
    data?: {
      errors?: Array<{
        label?: string
        message?: string
        path?: string
      }>
    }
    message?: string
  }>
}

export function SyncLayoutButton() {
  const { id } = useDocumentInfo() as { id?: string | number }
  const [syncing, setSyncing] = useState(false)

  const onSync = async () => {
    if (!id || syncing) return

    setSyncing(true)
    try {
      const res = await fetch(`/api/pages/${id}/sync-layouts`, {
        method: 'POST',
      })

      if (!res.ok) {
        let message = 'Could not sync layout. Please try again.'

        try {
          const data = (await res.json()) as SyncErrorResponse
          const fieldErrors = data?.errors?.[0]?.data?.errors

          if (fieldErrors && fieldErrors.length > 0) {
            const details = fieldErrors
              .map((err) => {
                const field = err.label || err.path || 'Field'
                const reason = err.message || 'Invalid value'
                return `${field}: ${reason}`
              })
              .join(' | ')

            message = `Sync failed. Please complete required fields first. ${details}`
          } else if (data?.errors?.[0]?.message) {
            message = `Sync failed: ${data.errors[0].message}`
          }
        } catch {
          // keep default fallback message
        }

        throw new Error(message)
      }

      toast.success('Layout synced from RO to RU/EN.')
      // Reload to fetch updated localized layout immediately.
      window.location.reload()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not sync layout. Please try again.'
      toast.error(message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        type="button"
        onClick={onSync}
        disabled={!id || syncing}
        style={{
          height: 36,
          padding: '0 14px',
          borderRadius: 4,
          border: '1px solid var(--theme-elevation-400)',
          background: 'var(--theme-elevation-0)',
          cursor: syncing ? 'wait' : 'pointer',
          opacity: !id || syncing ? 0.6 : 1,
          fontWeight: 600,
        }}
      >
        {syncing ? 'Syncing...' : 'Sync Layout'}
      </button>
    </div>
  )
}
