"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, Loader2 } from "lucide-react";
import type { ApiKey } from "@/lib/types";
import { useState } from "react";

interface KeyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: ApiKey;
  accessToken: string;
}

export function KeyDetailsModal({ isOpen, onClose, apiKey, accessToken }: KeyDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiUrl}/api/key/key/${apiKey.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      navigator.clipboard.writeText(data.key).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
          console.error('Failed to copy text: ', err);
      });
    } catch (error) {
      console.error("Failed to fetch key:", error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-zinc-950 w-full max-w-2xl m-4 p-6 rounded-lg border border-zinc-700 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-100">API Key Details</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:bg-zinc-800 cursor-pointer">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Title</label>
                <p className="text-lg text-zinc-100">{apiKey.name}</p>
              </div>
              {apiKey.service && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Service</label>
                  <p className="text-lg text-zinc-100">{apiKey.service}</p>
                </div>
              )}
              {apiKey.description && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Description</label>
                  <p className="text-lg text-zinc-100">{apiKey.description}</p>
                </div>
              )}
              {apiKey.reqSample && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Request Sample</label>
                  <pre className="bg-zinc-900 p-4 rounded-md text-sm text-zinc-100 overflow-x-auto">
                    {JSON.stringify(apiKey.reqSample, null, 2)}
                  </pre>
                </div>
              )}
              {apiKey.resSample && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Result Sample</label>
                  <pre className="bg-zinc-900 p-4 rounded-md text-sm text-zinc-100 overflow-x-auto">
                    {JSON.stringify(apiKey.resSample, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button onClick={handleCopy} disabled={isCopying}>
                {isCopying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : (copied ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />)} 
                {isCopying ? "Copying..." : (copied ? <span className="text-green-400">Copied!</span> : "Copy Key")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
