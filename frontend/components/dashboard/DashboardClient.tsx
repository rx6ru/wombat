"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Plus, AlertTriangle } from "lucide-react";

import { Button } from "../ui/button";
import { ApiKeyCard } from "./ApiKeyCard";
import { AddKeyModal } from "./AddKeyModal";
import type { ApiKey, ApiKeyInput } from "../../lib/types";

interface DashboardClientProps {
    initialApiKeys: ApiKey[];
    accessToken: string;
    fetchError: string | null;
}

export function DashboardClient({
    initialApiKeys,
    accessToken,
    fetchError,
}: DashboardClientProps) {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const handleAddKey = async (newKeyData: ApiKeyInput) => {
        setModalError(null);
        try {
            const response = await fetch(`${apiUrl}/key/key`, {
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

            const addedKey = await response.json();
            setApiKeys((prevKeys) => [...prevKeys, addedKey]);
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Error adding key:", error);
            setModalError(error.message);
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        try {
            const response = await fetch(`${apiUrl}/key/key/${keyId}`, {
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
        } catch (error) {
            console.error("Error deleting key:", error);
            // Here you could add a user-facing error message, e.g., using a toast notification
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
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setIsModalOpen(true)} size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Add Key
                            </Button>
                            <Button onClick={handleLogout} variant="outline" size="icon">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
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
                                    <p>Click &quot;Add Key&quot; to get started.</p>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </main>
            </div>
            <AddKeyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setModalError(null); }}
                onAddKey={handleAddKey}
                apiError={modalError}
            />
        </>
    );
}

