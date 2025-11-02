"use client";

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Edit } from "lucide-react";
import { ChangeUsernameModal } from "../../components/profile/ChangeUsernameModal";

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setAccessToken(session.access_token);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const usernameReq = fetch(`${apiUrl}/api/user/info/getUserInfo`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        const emailReq = supabase.auth.getUser();

        const [usernameRes, emailRes] = await Promise.all([usernameReq, emailReq]);

        if (!usernameRes.ok) {
          const errorData = await usernameRes.json();
          throw new Error(errorData.error || `Failed to fetch user info: ${usernameRes.statusText}`);
        }
        const userData = await usernameRes.json();

        if (emailRes.error) {
          throw new Error(`Failed to fetch user email: ${emailRes.error.message}`);
        }

        setProfile({
          username: userData.username,
          email: emailRes.data.user?.email || "No email found",
        });
      } catch (error: any) {
        console.error("Profile page fetch error:", error);
        setFetchError(error.message);
        setProfile({ username: "Error", email: "Could not load data" });
      }
    };

    fetchProfile();
  }, [router, supabase]);

  const handleUsernameChanged = (newUsername: string) => {
    if (profile) {
      setProfile({ ...profile, username: newUsername });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen w-full dark-dotted-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const initials = getInitials(profile.username);

  return (
    <>
      <div className="min-h-screen w-full dark-dotted-background">
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-700">
          <div className="container mx-auto flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold text-zinc-100">My Profile</h1>
            <Button asChild variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-lg mt-10 p-8 bg-zinc-950/50 border border-zinc-700 rounded-lg shadow-lg backdrop-blur-sm">
            {fetchError ? (
              <div className="text-center text-red-400 flex items-center justify-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                <p>Error: {fetchError}</p>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-700 text-3xl font-semibold text-zinc-100">
                    {initials}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">Username</label>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-zinc-100">{profile.username}</p>
                      <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
                        <Edit className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </div>
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

      {isModalOpen && accessToken && (
        <ChangeUsernameModal
          initialUsername={profile.username}
          accessToken={accessToken}
          onClose={() => setIsModalOpen(false)}
          onUsernameChanged={handleUsernameChanged}
        />
      )}
    </>
  );
}


