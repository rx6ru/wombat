import { createClient } from '../../lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import WelcomeClient from '../../components/auth/WelcomeClient';

// This is the server component for the onboarding page
export default async function WelcomePage() {
  const supabase = await createClient();

  // 1. Get the current user session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // If no user is logged in, redirect to the login page
    redirect('/login');
  }

  // 2. Call your backend to check if the user has a username
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let namePresent = false;
  let username = '';
  let error = null;

  try {
    const response = await fetch(`${apiUrl}/api/user/info/getUserInfo`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store', // Always fetch fresh data for this check
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const userData = await response.json();
    namePresent = userData.namePresent;
    username = userData.username;

  } catch (e: any) {
    console.error("Error fetching user info on welcome page:", e);
    error = e.message;
    // You could render an error state, but for now we'll show the form with a default name
    username = 'Wombat User';
  }


  // 3. If the user already has a name, redirect them to the dashboard
  if (namePresent) {
    redirect('/dashboard');
  }

  // 4. If no name is present, render the client component with the pre-filled username
  return (
    <WelcomeClient
      initialUsername={username}
      accessToken={session.access_token}
      apiError={error}
    />
  );
}

