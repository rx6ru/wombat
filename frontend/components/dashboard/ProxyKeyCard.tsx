'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProxyKey } from "../../lib/types";

interface ProxyKeyCardProps {
  proxyKey: ProxyKey;
  onDelete: (proxyKey: ProxyKey) => void;
}

export function ProxyKeyCard({ proxyKey, onDelete }: ProxyKeyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(proxyKey.key).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-zinc-950/50 border border-zinc-700 rounded-lg p-6 flex flex-col gap-4 shadow-lg backdrop-blur-sm hover:border-zinc-500 transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-zinc-100">{proxyKey.name}</h3>
          <p className="text-sm font-medium text-zinc-400">
            Created: {new Date(proxyKey.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-700 cursor-pointer" onClick={(e) => {e.stopPropagation(); handleCopy();}}>
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer" onClick={(e) => {e.stopPropagation(); onDelete(proxyKey);}}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {proxyKey.description && (
        <p className="text-sm text-zinc-400">{proxyKey.description}</p>
      )}
    </motion.div>
  );
}
