import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Get all users from auth.users
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get user roles from profiles table
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, role')
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Continue without profiles if table doesn't exist
    }

    // Merge user data with profiles
    const usersWithRoles = users.map(user => ({
      ...user,
      role: profiles?.find(p => p.user_id === user.id)?.role || 'viewer'
    }))

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Create user via Supabase auth admin
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json({ error: 'Failed to create user: ' + createError.message }, { status: 400 })
    }

    // Create user profile with role
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          role: role || 'viewer',
          email
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Still return success as user was created
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}