import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '../../components/dashboard/DashboardClient'
import type { ApiKey } from '../../lib/types'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  let apiKeys: ApiKey[] = []
  let fetchError: string | null = null
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  try {
    // Fetch API keys from your backend
    const response = await fetch(`${apiUrl}/key/keys`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store', // Ensure fresh data on every request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch keys: ${response.statusText}`);
    }
    
    apiKeys = await response.json()
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
  )
}

