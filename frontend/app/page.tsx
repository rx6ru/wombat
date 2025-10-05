import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import HomePageClient from '@/components/home/HomePageClient'

// For server-side logic
export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  // The UI part is now imported from its own file
  return <HomePageClient />
}