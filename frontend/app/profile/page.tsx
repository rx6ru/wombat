import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

// Helper function for initials
const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// Define the shape of our profile data
type UserProfile = {
  username: string;
  email: string;
};

// Asynchronously fetches all profile data
async function getProfile(accessToken: string, supabase: any): Promise<UserProfile> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Set up both API calls
  const usernameReq = fetch(`${apiUrl}/api/user/info/getUserInfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const emailReq = supabase.auth.getUser();

  // Await both promises in parallel
  const [usernameRes, emailRes] = await Promise.all([usernameReq, emailReq]);

  // Process username
  if (!usernameRes.ok) {
    const errorData = await usernameRes.json();
    throw new Error(errorData.error || `Failed to fetch user info: ${usernameRes.statusText}`);
  }
  const userData = await usernameRes.json();

  // Process email
  if (emailRes.error) {
    throw new Error(`Failed to fetch user email: ${emailRes.error.message}`);
  }

  return {
    username: userData.username,
    email: emailRes.data.user?.email || "No email found",
  };
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  let profile: UserProfile;
  let fetchError: string | null = null;

  try {
    profile = await getProfile(session.access_token, supabase);
  } catch (error: any) {
    console.error("Profile page fetch error:", error);
    fetchError = error.message;
    profile = { username: "Error", email: "Could not load data" };
  }

  const initials = getInitials(profile.username);

  return (
    <div className="min-h-screen w-full dark-dotted-background">
      {/* Simplified Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-700">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-zinc-100">
            My Profile
          </h1>
          <Button asChild variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Profile Card Content */}
      <main className="container mx-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-lg mt-10 p-8 bg-zinc-950/50 border border-zinc-700 rounded-lg shadow-lg backdrop-blur-sm">
          {fetchError ? (
            <div className="text-center text-red-400 flex items-center justify-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <p>Error: {fetchError}</p>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-700 text-3xl font-semibold text-zinc-100">
                  {initials}
                </div>
              </div>
              {/* Details */}
              <div className="flex-grow">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-zinc-500">Username</label>
                  <p className="text-xl font-bold text-zinc-100">{profile.username}</p>
                </div>
                <div className="mt-4 space-y-1">
                  <label className="text-xs font-semibold uppercase text-zinc-500">Email</label>
                  <p className="text-md text-zinc-300">{profile.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

