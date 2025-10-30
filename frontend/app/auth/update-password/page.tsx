'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Home as HomeIcon } from 'lucide-react';

// Component to show password requirements
const PasswordRequirement = ({ label, meets }: { label: string; meets: boolean }) => (
    <div className={`flex items-center text-xs transition-colors ${meets ? 'text-green-400' : 'text-zinc-500'}`}>
        {meets ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <XCircle className="w-3 h-3 mr-1.5" />}
        {label}
    </div>
);

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!isPasswordValid) {
      setError('Please ensure your password meets all the requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been updated successfully!');
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="dark-dotted-background flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950/50 p-8 shadow-lg backdrop-blur-sm text-center"
        >
          <h1 className="text-2xl font-bold text-zinc-100">Invalid Link</h1>
          <p className="mt-2 text-sm text-zinc-400">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/login/forgot-password" className="mt-6 block">
            <Button className="w-full">
              Request New Password Reset Link
            </Button>
          </Link>
          <p className="mt-4 text-center text-sm text-zinc-400">
            <Link href="/login" className="font-medium text-white hover:underline">
              Back to Login
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-zinc-100">Set New Password</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400" htmlFor="password">New Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400" htmlFor="confirmPassword">Confirm New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              <PasswordRequirement label="8+ characters" meets={passwordRequirements.length} />
              <PasswordRequirement label="1 uppercase" meets={passwordRequirements.uppercase} />
              <PasswordRequirement label="1 lowercase" meets={passwordRequirements.lowercase} />
              <PasswordRequirement label="1 number" meets={passwordRequirements.number} />
              <PasswordRequirement label="1 special" meets={passwordRequirements.special} />
          </div>

          {message && <p className="text-sm text-center text-green-400 pt-2">{message}</p>}
          {error && <p className="text-sm text-center text-red-400 pt-2">{error}</p>}

          <Button type="submit" className="w-full !mt-6" disabled={loading || !isPasswordValid || !passwordsMatch}>
            {loading ? 'Updating...' : 'Update Password'}
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
