'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="dark-dotted-background flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950/50 p-8 shadow-lg backdrop-blur-sm text-center"
      >
        <MailCheck className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-zinc-100">Verify Your Email</h1>
        <p className="mt-2 text-sm text-zinc-400">
          We&apos;ve sent a verification link to your email address. Please check your inbox (and spam folder) to complete your registration.
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          After verifying your email, you can proceed to log in.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          If you don&apos;t receive an email, your account might already exist. Please try logging in or resetting your password.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button className="w-full">
            Continue to Login
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
