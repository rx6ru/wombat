"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApiKey, ApiKeyInput } from "@/lib/types";

interface EditKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditKey: (keyData: ApiKeyInput) => Promise<void>;
  apiKey: ApiKey;
  apiError?: string | null;
}

export function EditKeyModal({ isOpen, onClose, onEditKey, apiKey, apiError }: EditKeyModalProps) {
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [reqSample, setReqSample] = useState("");
  const [resSample, setResSample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (apiKey) {
      setTitle(apiKey.name);
      setKey(""); // Do not pre-fill the key for security reasons
      setService(apiKey.service || "");
      setDescription(apiKey.description || "");
      setReqSample(apiKey.reqSample ? JSON.stringify(apiKey.reqSample, null, 2) : "");
      setResSample(apiKey.resSample ? JSON.stringify(apiKey.resSample, null, 2) : "");
    }
  }, [apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title) {
        setFormError('Title is required.');
        return;
    }

    setIsLoading(true);

    const payload: ApiKeyInput = {
      name: title,
      service,
      description,
      reqSample,
      resSample,
    };

    // Only add key to payload if it's provided
    if (key) {
      payload.key = key;
    }

    await onEditKey(payload);
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-zinc-100">Edit API Key</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-400">Title</label>
                  <Input
                    placeholder="e.g. OpenAI Dev Key"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400">API Key (Optional, leave blank to keep current)</label>
                  <Input
                    placeholder="sk-..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
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
                  <label className="text-sm font-medium text-zinc-400">Description (Optional)</label>
                  <Textarea
                    placeholder="Used for the new project feature..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400">Request Sample (JSON, Optional)</label>
                  <Textarea
                    placeholder='{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
}'
                    value={reqSample}
                    onChange={(e) => setReqSample(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400">Result Sample (JSON, Optional)</label>
                  <Textarea
                    placeholder='{
  "id": "chatcmpl-...
}'
                    value={resSample}
                    onChange={(e) => setResSample(e.target.value)}
                    className="mt-1"
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
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
