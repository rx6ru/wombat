import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApiKeyInput } from "@/lib/types";

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKey: (keyData: ApiKeyInput) => Promise<void>;
  apiError?: string | null;
}

export function AddKeyModal({ isOpen, onClose, onAddKey, apiError }: AddKeyModalProps) {
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [reqSample, setReqSample] = useState("");
  const [resSample, setResSample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleClose = () => {
    setTitle("");
    setKey("");
    setService("");
    setDescription("");
    setReqSample("");
    setResSample("");
    setFormError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !key) {
        setFormError('Title and API Key are required.');
        return;
    }

    try {
      if (reqSample) JSON.parse(reqSample);
      if (resSample) JSON.parse(resSample);
    } catch (error) {
      setFormError("Invalid JSON format in Request or Result Sample.");
      return;
    }

    setIsLoading(true);
    await onAddKey({ name: title, key, service, description, reqSample, resSample });
    setIsLoading(false);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
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
              <h2 className="text-2xl font-bold text-zinc-100">Add New API Key</h2>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-zinc-400 hover:bg-zinc-800 cursor-pointer">
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
                  <Button type="button" variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Key"}
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