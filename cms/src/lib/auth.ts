import { createClient } from './supabase/server'
import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name?: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Security: Only return safe, non-sensitive user information
    return {
      // Do not expose: id (UUID), tokens, timestamps, metadata
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0],
    }
  } catch (error) {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

