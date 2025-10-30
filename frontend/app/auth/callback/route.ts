import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code') // For OAuth

  // New method for handling email verification links (access_token and refresh_token in URL)
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');

  const supabase = await createClient(); // Corrected createClient call

  if (access_token && refresh_token) {
    // Set the session cookies directly
    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    // Redirect to welcome page after successful verification
    return NextResponse.redirect(`${origin}/welcome`);
  }

  // Original code for handling 'code' (e.g., OAuth)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/welcome`);
    }
  }

  // If there's an error or no relevant parameters, redirect to an error page.
  console.error("Authentication callback error or no relevant parameters found.");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

