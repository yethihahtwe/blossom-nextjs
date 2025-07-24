import { supabase } from './supabase'

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function requireAuth() {
  const { user, error } = await getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}