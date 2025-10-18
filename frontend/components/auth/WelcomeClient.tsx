"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { generateRandomName } from '../../lib/randomName';

interface WelcomeClientProps {
  initialUsername: string;
  accessToken: string;
  apiError: string | null;
}

export default function WelcomeClient({ initialUsername, accessToken, apiError }: WelcomeClientProps) {
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(apiError);

  const handleGenerateRandomName = () => {
    setUsername(generateRandomName());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${apiUrl}/api/user/info/updateUserInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update username');
      }

      // On success, redirect to the dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-zinc-100">Welcome to Wombat Vault!</h1>
          <p className="mt-2 text-zinc-400">Let&apos;s set up your display name.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-zinc-400">
              Username
            </label>
            <div className="flex gap-2">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-grow"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateRandomName}
                aria-label="Generate random name"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

