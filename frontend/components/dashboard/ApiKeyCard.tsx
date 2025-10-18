"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, KeyRound, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiKey } from "../../lib/types";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
}

export function ApiKeyCard({ apiKey, onDelete }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key).then(() => {
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
      className="bg-zinc-950/50 border border-zinc-700 rounded-lg p-6 flex flex-col gap-4 shadow-lg backdrop-blur-sm"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-zinc-100">{apiKey.name}</h3>
          {apiKey.service && (
            <p className="text-sm font-medium text-zinc-400">{apiKey.service}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => onDelete(apiKey.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {apiKey.description && (
        <p className="text-sm text-zinc-400">{apiKey.description}</p>
      )}

      <div>
        <label className="text-xs font-semibold text-zinc-500 flex items-center mb-1">
          <KeyRound className="h-3 w-3 mr-1.5" />
          API KEY
        </label>
        <div className="flex items-center gap-2">
          <div className="w-full bg-zinc-900 px-3 py-2 rounded-md font-mono text-sm tracking-wider text-zinc-300">
            {showKey ? apiKey.key : "•".repeat(24)}
          </div>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-700" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
             </Button>
             <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-700" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

