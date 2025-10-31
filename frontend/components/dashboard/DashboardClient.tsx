"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, AlertTriangle } from "lucide-react"; // Removed LogOut

import { Button } from "../ui/button";
import { ApiKeyCard } from "./ApiKeyCard";
import { AddKeyModal } from "./AddKeyModal";
import { UserNav } from "./UserNav"; // Import the new UserNav
import type { ApiKey, ApiKeyInput } from "../../lib/types";

interface DashboardClientProps {
    initialApiKeys: ApiKey[];
    accessToken: string;
    fetchError: string | null;
    username: string; // Add username prop
}

export function DashboardClient({
    initialApiKeys,
    accessToken,
    fetchError,
    username, // Get username from props
}: DashboardClientProps) {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const router = useRouter(); // Keep router for profile nav
    const supabase = createClient();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // handleLogout is now inside UserNav.tsx

    const handleAddKey = async (newKeyData: ApiKeyInput) => {
        setModalError(null);
        try {
            // 1. Create the new key
            const response = await fetch(`${apiUrl}/api/key/key`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newKeyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add key");
            }

            // 2. Refetch the list of keys to get the most up-to-date data
            const newKeysResponse = await fetch(`${apiUrl}/api/key/keys`, {
              headers: { Authorization: `Bearer ${accessToken}` },
              cache: 'no-store',
            });
            
            if (!newKeysResponse.ok) {
                throw new Error("Key was created, but failed to refetch the list.");
            }

            const keysData = await newKeysResponse.json();
            if (Array.isArray(keysData.data)) {
                setApiKeys(keysData.data);
            }
            
            setIsModalOpen(false); // Close modal on success
        } catch (error: any) {
            console.error("Error adding key:", error);
            setModalError(error.message);
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/key/key/${keyId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status !== 204) {
                 const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete key");
            }

            setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== keyId));
        } catch (error: any) {
            console.error("Error deleting key:", error);
            // You could show a toast notification here
        }
    };

    return (
        <>
            <div className="min-h-screen w-full dark-dotted-background">
                <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-700">
                    <div className="container mx-auto flex items-center justify-between h-16 px-4">
                        <h1 className="text-xl font-bold text-zinc-100">
                            Wombat Vault
                        </h1>
                        {/* --- MODIFIED HEADER --- */}
                        <div className="flex items-center gap-4">
                            <UserNav username={username} />
                        </div>
                        {/* --- END MODIFIED HEADER --- */}
                    </div>
                </header>

                <main className="container mx-auto p-4 md:p-8">
                    {fetchError && (
                        <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-4">
                            <AlertTriangle className="h-6 w-6" />
                            <div>
                                <h3 className="font-bold">Connection Error</h3>
                                <p className="text-sm">{fetchError}</p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {apiKeys.length > 0 ? (
                             <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {apiKeys.map((key) => (
                                    <ApiKeyCard
                                        key={key.id}
                                        apiKey={key}
                                        onDelete={handleDeleteKey}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                             !fetchError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-24 text-zinc-500"
                                >
                                    <p className="text-lg">Your vault is empty.</p>
                                    <p>Click the &quot;+&quot; button to get started.</p>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* --- FLOATING ADD KEY BUTTON --- */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-8 right-8 z-50 rounded-full h-14 w-14 shadow-lg text-white bg-zinc-700 hover:bg-zinc-600"
              size="icon"
              aria-label="Add new API key"
            >
              <Plus className="h-6 w-6" />
            </Button>
            {/* --- END FLOATING BUTTON --- */}

            <AddKeyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setModalError(null); }}
                onAddKey={handleAddKey}
                apiError={modalError}
            />
        </>
    );
}

