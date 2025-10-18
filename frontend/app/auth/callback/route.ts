import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // This 'next' parameter is used for server-side redirects post-auth
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // On successful code exchange (from email link or OAuth),
      // redirect to the welcome page for the username check.
      return NextResponse.redirect(`${origin}/welcome`);
    }
  }

  // If there's an error or no code, redirect to an error page.
  console.error("Authentication callback error or no code found.");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

