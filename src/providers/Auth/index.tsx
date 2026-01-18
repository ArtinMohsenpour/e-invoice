'use client'
import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User } from '@/payload-types'

type AuthContextType = {
  user: User | null | undefined // undefined means loading
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }, [])

  // On mount, check if user has a valid secure cookie
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
