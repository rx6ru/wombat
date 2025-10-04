    "use client";

    import { useState } from "react";
    import { motion, AnimatePresence } from "framer-motion";
    import { X } from "lucide-react";

    import { Button } from "@/components/ui/Button";
    import { Input } from "@/components/ui/Input";
    import { Textarea } from "@/components/ui/Textarea";
    import type { ApiKeyInput } from "@/lib/types";

    interface AddKeyModalProps {
      isOpen: boolean;
      onClose: () => void;
      onAddKey: (keyData: ApiKeyInput) => Promise<void>;
    }

    export function AddKeyModal({ isOpen, onClose, onAddKey }: AddKeyModalProps) {
      const [name, setName] = useState("");
      const [service, setService] = useState("");
      const [key, setKey] = useState("");
      const [description, setDescription] = useState("");
      const [isLoading, setIsLoading] = useState(false);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onAddKey({ name, service, key, description });
        setIsLoading(false);
        // Reset form on successful submission
        setName("");
        setService("");
        setKey("");
        setDescription("");
      };

      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-card w-full max-w-lg m-4 p-6 rounded-lg border shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Add New API Key</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="e.g. OpenAI Dev Key"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Service (Optional)</label>
                    <Input
                      placeholder="e.g. OpenAI"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                      placeholder="sk-..."
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      placeholder="Used for the new project feature..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
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
   

