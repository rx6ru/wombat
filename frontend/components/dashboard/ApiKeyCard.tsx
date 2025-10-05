"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion"; // Import the 'Variants' type
import { Eye, EyeOff, KeyRound, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ApiKey } from "@/lib/types";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
}

export function ApiKeyCard({ apiKey, onDelete }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = apiKey.key;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  // Add the 'Variants' type annotation to the animation object
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className="bg-card border rounded-lg p-6 flex flex-col gap-4 shadow-sm"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-foreground">{apiKey.name}</h3>
          {apiKey.service && (
            <p className="text-sm font-medium text-primary">{apiKey.service}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(apiKey.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {apiKey.description && (
        <p className="text-sm text-muted-foreground">{apiKey.description}</p>
      )}

      <div>
        <label className="text-xs font-semibold text-muted-foreground flex items-center mb-1">
          <KeyRound className="h-3 w-3 mr-1.5" />
          API KEY
        </label>
        <div className="flex items-center gap-2">
          <div className="w-full bg-secondary px-3 py-2 rounded-md font-mono text-sm tracking-wider">
            {showKey ? apiKey.key : "•".repeat(24)}
          </div>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
             </Button>
             <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
             </Button>
          </div>
        </div>
        {copied && <p className="text-xs text-green-500 mt-1 text-right">Copied!</p>}
      </div>
    </motion.div>
  );
}