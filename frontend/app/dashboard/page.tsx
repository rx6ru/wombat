import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { ApiKey } from '@/lib/types';
// No longer need cookies, createClient() handles it
// import { cookies } from 'next/headers'; 

export default async function DashboardPage() {
  // FIX: createClient() for server components is called with no arguments
  // as it handles cookies internally.
  const supabase = await createClient(); 

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // --- NEW: Fetch Username ---
  let username = "Wombat User"; // Default
  let apiKeys: ApiKey[] = [];
  let fetchError: string | null = null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    // 1. Fetch User Info
    const userRes = await fetch(`${apiUrl}/api/user/info/getUserInfo`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store',
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      username = userData.username || "Wombat User";
    } else {
      console.error("Failed to fetch username");
      fetchError = "Could not load user profile.";
    }

    // 2. Fetch API Keys
    const keysRes = await fetch(`${apiUrl}/api/key/keys`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store',
    });

    if (keysRes.ok) {
      const keysData = await keysRes.json();
      if (Array.isArray(keysData.data)) {
        apiKeys = keysData.data;
      } else {
        console.error("Dashboard fetch error: Expected keys.data to be an array");
        apiKeys = [];
        // Append error, don't overwrite
        fetchError = (fetchError ? fetchError + " " : "") + "Received invalid key data.";
      }
    } else {
       // Append error, don't overwrite
       const keysError = `Failed to fetch keys: ${keysRes.statusText}`;
       console.error(keysError);
       fetchError = (fetchError ? fetchError + " " : "") + keysError;
    }

  } catch (error: unknown) {
    console.error("Dashboard fetch error:", error);
    if (error instanceof Error && !fetchError) {
      fetchError = error.message;
    }
  }

  return (
    <DashboardClient 
      initialApiKeys={apiKeys} 
      accessToken={session.access_token}
      fetchError={fetchError}
      username={username} // Pass username as a prop
    />
  );
}

