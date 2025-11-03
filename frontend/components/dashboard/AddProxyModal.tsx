"use client";
// Note: This is a placeholder as no backend API exists for it yet.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface AddProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProxy: (proxyData: { title: string; description: string }) => Promise<void>;
  apiError?: string | null;
}

export function AddProxyModal({
  isOpen,
  onClose,
  onAddProxy,
  apiError,
}: AddProxyModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalUsageLimit, setTotalUsageLimit] = useState<number | ''>('');
  const [usageLimitCalls, setUsageLimitCalls] = useState<number | ''>('');
  const [usageLimitUnit, setUsageLimitUnit] = useState("minute"); // Default unit
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }

    setIsLoading(true);
    await onAddProxy({ title, description });
    setIsLoading(false);
    // Reset form on successful submission
    setTitle("");
    setDescription("");
    setTotalUsageLimit('');
    setUsageLimitCalls('');
    setUsageLimitUnit("minute");
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
                <label htmlFor="title" className="text-sm font-medium text-zinc-400">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="e.g. Public GPT-4 Key"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-zinc-400">
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="A brief description of the proxy key's purpose."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="totalUsageLimit" className="text-sm font-medium text-zinc-400">
                  Total Usage Limit (Optional)
                </label>
                <Input
                  id="totalUsageLimit"
                  type="number"
                  placeholder="e.g. 100000"
                  value={totalUsageLimit}
                  onChange={(e) => setTotalUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  min="0"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Usage Limit per Unit Time (Optional)
                </label>
                <div className="flex gap-2 mt-1 items-center">
                  <Input
                    type="number"
                    placeholder="Calls"
                    value={usageLimitCalls}
                    onChange={(e) => setUsageLimitCalls(e.target.value === '' ? '' : Number(e.target.value))}
                    min="0"
                    className="flex-grow"
                  />
                  <span className="text-zinc-400 text-sm">/</span>
                  <select
                    value={usageLimitUnit}
                    onChange={(e) => setUsageLimitUnit(e.target.value)}
                    className="flex-grow h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100 bg-zinc-800/50 border-zinc-700"
                  >
                    <option value="minute">Minute</option>
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>

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

