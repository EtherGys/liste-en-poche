'use client'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'

export const AuthProvider = ({children, session} : SessionProviderProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider