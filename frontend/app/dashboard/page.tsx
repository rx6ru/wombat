import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { ApiKey } from '@/lib/types'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  let apiKeys: ApiKey[] = []
  let fetchError: string | null = null

  try {
    // Fetch API keys from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/key/keys`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: 'no-store', // Ensure fresh data on every request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch keys: ${response.statusText}`);
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

