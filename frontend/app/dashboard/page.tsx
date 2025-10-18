import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { ApiKey } from '@/lib/types';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  let apiKeys: ApiKey[] = [];
  let fetchError: string | null = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/key/keys`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store', // Ensure fresh data on every request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch keys: ${response.statusText}`);
    }
    
    const data = await response.json();
    const keys = data.data;

    // FIX: Ensure that the data received from the API is an array.
    // This prevents the "not iterable" error if the API returns a non-array response (e.g., an error object).
    if (Array.isArray(keys)) {
      apiKeys = keys;
    } else {
      // If the response is not an array, default to an empty array and log an error.
      apiKeys = [];
      fetchError = "Received an invalid response from the server.";
      console.error("Dashboard fetch error: Expected an array of keys, but received:", keys);
    }

  } catch (error: unknown) {
    console.error("Dashboard fetch error:", error);
    if (error instanceof Error) {
      fetchError = error.message;
    } else {
      fetchError = "An unknown error occurred while fetching API keys."
    }
  }

  return (
    <DashboardClient 
      initialApiKeys={apiKeys} 
      accessToken={session.access_token}
      fetchError={fetchError}
    />
  );
}

