import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req }) => {
  console.log('req.user =', req.user)
  console.log('cookie =', req.headers.get?.('cookie'))
  return Boolean(req.user)
}
