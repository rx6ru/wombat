'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailCheck, Home as HomeIcon } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('If an account with that email exists, a password reset link has been sent to your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="dark-dotted-background flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline" className="text-zinc-400 hover:text-zinc-100 border-zinc-700 hover:border-zinc-500">
          <HomeIcon className="lucide lucide-home mr-2" size={20} />
          Wombat Vault
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950/50 p-8 shadow-lg backdrop-blur-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100">Forgot Your Password?</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {message && <p className="text-sm text-center text-green-400 pt-2"><MailCheck className="inline-block mr-2" size={16} />{message}</p>}
          {error && <p className="text-sm text-center text-red-400 pt-2">{error}</p>}

          <Button type="submit" className="w-full !mt-6" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/login" className="font-medium text-white hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
