"use client";

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // On successful login, redirect to the welcome page for the username check
      window.location.href = '/welcome';
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
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
          <p className="mt-2 text-zinc-400">Log in to access your Wombat Vault.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
          
          {error && (
            <p className="text-sm text-center text-red-400">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <Chrome className="mr-2 h-4 w-4" />
          Login with Google
        </Button>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-zinc-100 hover:underline">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

