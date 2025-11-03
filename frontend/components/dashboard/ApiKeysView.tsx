import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { ApiKeyCard } from "./ApiKeyCard";
import { EditKeyModal } from "./EditKeyModal";
import { KeyDetailsModal } from "./KeyDetailsModal";
import { AddProxyModal } from "./AddProxyModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import type { ApiKey, ApiKeyInput } from "../../lib/types";

interface ApiKeysViewProps {
  apiKeys: ApiKey[];
  fetchError: string | null;
  onDeleteKey: (id: string) => void;
  onEditKey: (id: string, keyData: ApiKeyInput) => Promise<void>;
  onGenerateProxy: (apiKey: ApiKey) => void;
  onAddProxy: (proxyData: { title: string; description: string }) => Promise<void>;
  hasMore: boolean;
  accessToken: string;
  noResults: boolean;
}

export function ApiKeysView({
  apiKeys,
  fetchError,
  onDeleteKey,
  onEditKey,
  onGenerateProxy,
  onAddProxy,
  hasMore,
  accessToken,
  noResults,
}: ApiKeysViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAddProxyModalOpen, setIsAddProxyModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);

  const handleEdit = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsEditModalOpen(true);
  };

  const handleInfo = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsInfoModalOpen(true);
  };

  const handleGenerateProxy = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsAddProxyModalOpen(true);
  };

  const handleDelete = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedApiKey(null);
    setIsEditModalOpen(false);
  };

  const handleCloseInfoModal = () => {
    setSelectedApiKey(null);
    setIsInfoModalOpen(false);
  };

  const handleCloseAddProxyModal = () => {
    setSelectedApiKey(null);
    setIsAddProxyModalOpen(false);
  };

  const handleCloseConfirmDeleteModal = () => {
    setSelectedApiKey(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleEditKey = async (keyData: ApiKeyInput) => {
    if (selectedApiKey) {
      await onEditKey(selectedApiKey.id, keyData);
      handleCloseEditModal();
    }
  };

  const handleDeleteKeyConfirm = () => {
    if (selectedApiKey) {
      onDeleteKey(selectedApiKey.id);
      handleCloseConfirmDeleteModal();
    }
  };

  if (fetchError) {
    return (
      <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-4 rounded-lg m-4 md:m-8 flex items-center gap-4">
        <AlertTriangle className="h-6 w-6" />
        <div>
          <h3 className="font-bold">Connection Error</h3>
          <p className="text-sm">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {apiKeys && apiKeys.length > 0 ? (
        <motion.div
          layout
          className="flex flex-col gap-4 p-4 md:p-8"
        >
          {apiKeys.map((key) => (
            <ApiKeyCard
              key={key.id}
              apiKey={key}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onInfo={handleInfo}
              onGenerateProxy={handleGenerateProxy}
              accessToken={accessToken}
            />
          ))}
          {hasMore && <div className="text-center text-zinc-500">Loading more...</div>}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center py-24 text-zinc-500"
        >
          {noResults ? (
            <p className="text-lg">No API keys found matching your search.</p>
          ) : (
            <>
              <p className="text-lg">Your vault is empty.</p>
              <p>Click the &quot;Add Key&quot; button to get started.</p>
            </>
          )}
        </motion.div>
      )}
      {selectedApiKey && (
        <EditKeyModal
          key={`edit-${selectedApiKey.id}`}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onEditKey={handleEditKey}
          apiKey={selectedApiKey}
        />
      )}
      {selectedApiKey && (
        <KeyDetailsModal
          key={`details-${selectedApiKey.id}`}
          isOpen={isInfoModalOpen}
          onClose={handleCloseInfoModal}
          apiKey={selectedApiKey}
          accessToken={accessToken}
        />
      )}
      {selectedApiKey && (
        <AddProxyModal
          key={`proxy-${selectedApiKey.id}`}
          isOpen={isAddProxyModalOpen}
          onClose={handleCloseAddProxyModal}
          onAddProxy={onAddProxy}
        />
      )}
      {selectedApiKey && (
        <ConfirmDeleteModal
          key={`delete-${selectedApiKey.id}`}
          isOpen={isConfirmDeleteModalOpen}
          onClose={handleCloseConfirmDeleteModal}
          onConfirm={handleDeleteKeyConfirm}
          title="Delete API Key"
          description="Are you sure you want to delete this API key? This action cannot be undone."
        />
      )}
    </AnimatePresence>
  );
}

