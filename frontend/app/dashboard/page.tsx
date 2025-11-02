import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "../../components/dashboard/DashboardClient";
import { ApiKey } from "../../lib/types";
import { cache } from "react";

export const getUserInfo = cache(async (accessToken: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const userResponse = await fetch(`${apiUrl}/api/user/info/getUserInfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!userResponse.ok) {
    console.error("Failed to fetch username");
    return "User";
  }
  const userData = await userResponse.json();
  return userData.username || "User";
});

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  let apiKeys: {
    data: ApiKey[];
    nextCursor: string | null;
    hasMore: boolean;
  } = { data: [], nextCursor: null, hasMore: false };
  let fetchError: string | null = null;

  const username = await getUserInfo(session.access_token);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/key/keys`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch keys: ${response.statusText}`);
    }

    const data = await response.json();
    apiKeys.data = data.data;
    apiKeys.nextCursor = data.nextCursor;
    apiKeys.hasMore = data.hasMore;
  } catch (error: unknown) {
    console.error("Dashboard fetch error:", error);
    if (error instanceof Error) {
      fetchError = error.message;
    } else {
      fetchError = "An unknown error occurred while fetching data.";
    }
  }

  return (
    <DashboardClient
      initialApiKeys={apiKeys}
      accessToken={session.access_token}
      fetchError={fetchError}
      username={username}
    />
  );

}


