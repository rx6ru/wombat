import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // On successful auth, redirect the user to the new welcome/onboarding page
      return NextResponse.redirect(`${origin}/welcome`);
    }
    
    console.error("Supabase authentication error:", error.message);
  } else {
    console.error("Authentication callback error: No code provided.");
  }

  // If there's an error or no code, redirect to an error page
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`);
}

