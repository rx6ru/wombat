"use client";

import { motion } from "framer-motion";
import { ProxyKeyCard } from "./ProxyKeyCard";
import type { ProxyKey } from "../../lib/types";

interface ProxyKeysViewProps {
  proxyKeys: ProxyKey[];
  fetchError: string | null;
  onDeleteProxyKey: (id: string) => void;
}

export function ProxyKeysView({ proxyKeys, fetchError, onDeleteProxyKey }: ProxyKeysViewProps) {

  const handleDelete = (proxyKey: ProxyKey) => {
    onDeleteProxyKey(proxyKey.id);
  };

  if (fetchError) {
    return (
      <div className="text-center text-red-400 p-8">
        Error fetching proxy keys: {fetchError}
      </div>
    );
  }

  if (proxyKeys.length === 0) {
    return (
      <div className="text-center text-zinc-500 p-8">
        You haven't created any proxy keys yet.
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {proxyKeys.map((key) => (
        <ProxyKeyCard
          key={key.id}
          proxyKey={key}
          onDelete={handleDelete}
        />
      ))}
    </motion.div>
  );
}


