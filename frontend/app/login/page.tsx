"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// A simple inline SVG for the Google icon
const GoogleIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="google"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 399.5 0 261.8S111.8 11.6 244 11.6c70.3 0 129.8 28.7 173.4 74.5l-69.8 69.8C301.1 113.4 274.6 97.4 244 97.4c-69.9 0-126.6 56.7-126.6 126.6s56.7 126.6 126.6 126.6c76.2 0 114.3-51.4 118.8-77.9H244v-91.2h233.5c4.7 26.9 7.5 56.6 7.5 88.1z"
    ></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // On successful login, redirect to the welcome page for the username check.
      // The middleware will handle session refresh.
      window.location.href = "/welcome";
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="dark-dotted-background flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Welcome Back</h1>
          <p className="mt-2 text-zinc-400">
            Log in to access your Wombat Vault.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full mt-8"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <GoogleIcon />
          Log in with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">
              Or log in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-center text-red-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-zinc-100 hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
