"use client";

import { motion } from "framer-motion";
import { ShieldHalf } from "lucide-react";
import { ProxyKey } from "../../lib/types";

interface ProxyKeysViewProps {
  proxyKeys: ProxyKey[];
  fetchError: string | null;
}

export function ProxyKeysView({ proxyKeys, fetchError }: ProxyKeysViewProps) {
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 text-red-500">
        <ShieldHalf className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold text-red-400">Error</h2>
        <p className="text-lg mt-2">{fetchError}</p>
      </div>
    );
  }

  if (proxyKeys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center py-24 text-zinc-500"
      >
        <ShieldHalf className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-300">No Proxy Keys Yet</h2>
        <p className="text-lg mt-2">Click the "Create Proxy Key" button to get started.</p>
      </motion.div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Proxy Keys</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {proxyKeys.map((key) => (
          <div key={key.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white">{key.name}</h3>
            <p className="text-sm text-zinc-400">{key.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

