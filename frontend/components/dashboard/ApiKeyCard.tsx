import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Copy, Trash2, Check, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiKey } from "../../lib/types";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (id: string) => Promise<void>;
  onEdit: (apiKey: ApiKey) => void;
  accessToken: string;
}

export function ApiKeyCard({ apiKey, onDelete, onEdit, accessToken }: ApiKeyCardProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

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

  const handleDelete = async () => {
    setIsConfirmDeleteOpen(false);
    setIsDeleting(true);
    try {
      await onDelete(apiKey.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-zinc-950/50 border border-zinc-700 rounded-lg p-6 flex flex-col gap-4 shadow-lg backdrop-blur-sm ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-zinc-100">{apiKey.name}</h3>
          {apiKey.service && (
            <p className="text-sm font-medium text-zinc-400">{apiKey.service}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-700" onClick={() => onEdit(apiKey)} disabled={isDeleting}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => setIsConfirmDeleteOpen(true)} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
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
            {"•".repeat(24)}
          </div>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-700" onClick={handleCopy} disabled={isDeleting || isCopying}>
                {isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : (copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />)}
             </Button>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete API Key"
        description="Are you sure you want to delete this API key? This action cannot be undone."
      />
    </motion.div>
  );
}

