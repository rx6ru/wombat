"use client";
// Note: This is a placeholder as no backend API exists for it yet.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface AddProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onAddProxy: (proxyData: any) => Promise<void>; // To be implemented
  apiError?: string | null;
}

export function AddProxyModal({
  isOpen,
  onClose,
  // onAddProxy,
  apiError,
}: AddProxyModalProps) {
  const [proxyName, setProxyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!proxyName) {
      setFormError("Proxy Name is required.");
      return;
    }

    setIsLoading(true);
    // Placeholder for API call
    console.log("Creating proxy with name:", proxyName);
    // await onAddProxy({ name: proxyName });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake network delay
    setIsLoading(false);
    onClose();
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
            className="bg-zinc-950 w-full max-w-lg m-4 p-6 rounded-lg border border-zinc-700 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-100">
                Create New Proxy Key
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-zinc-400 hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Proxy Name
                </label>
                <Input
                  placeholder="e.g. Public GPT-4 Key"
                  value={proxyName}
                  onChange={(e) => setProxyName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Future fields (like selecting an API key) would go here */}

              {(formError || apiError) && (
                <p className="text-sm text-center text-red-400 pt-2">
                  {formError || apiError}
                </p>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Proxy"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

