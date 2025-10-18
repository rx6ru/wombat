"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiKeyInput } from "@/lib/types";

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKey: (keyData: ApiKeyInput) => Promise<void>;
  apiError?: string | null;
}

export function AddKeyModal({ isOpen, onClose, onAddKey, apiError }: AddKeyModalProps) {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name || !key) {
        setFormError('Name and API Key are required.');
        return;
    }

    setIsLoading(true);
    await onAddKey({ name, service, key, description });
    setIsLoading(false);
    // Parent component will close modal on success
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
              <h2 className="text-2xl font-bold text-zinc-100">Add New API Key</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">Name</label>
                <Input
                  placeholder="e.g. OpenAI Dev Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">Service (Optional)</label>
                <Input
                  placeholder="e.g. OpenAI"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">API Key</label>
                <Input
                  placeholder="sk-..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">Description (Optional)</label>
                <textarea
                  placeholder="Used for the new project feature..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {(formError || apiError) && (
                <p className="text-sm text-center text-red-400 pt-2">{formError || apiError}</p>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Key"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

