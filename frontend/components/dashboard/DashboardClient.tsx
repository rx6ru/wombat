"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Plus, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ApiKeyCard } from "@/components/dashboard/ApiKeyCard";
import { AddKeyModal } from "@/components/dashboard/AddKeyModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ApiKey, ApiKeyInput } from "@/lib/types";

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
    const router = useRouter();
    const supabase = createClient();

    // API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const handleAddKey = async (newKeyData: ApiKeyInput) => {
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
                throw new Error("Failed to add key");
            }

            const addedKey = await response.json();
            setApiKeys((prevKeys) => [...prevKeys, addedKey]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding key:", error);
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
                // DELETE should return 204 No Content
                throw new Error("Failed to delete key");
            }

            setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== keyId));
        } catch (error) {
            console.error("Error deleting key:", error);
            // Here you could add a user-facing error message, e.g., using a toast notification
        }
    };

    return (
        <>
            <div className="min-h-screen w-full bg-secondary/50">
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                    <div className="container mx-auto flex items-center justify-between h-16 px-4">
                        <h1 className="text-xl font-bold text-foreground">
                            Wombat Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Button onClick={handleLogout} variant="ghost" size="icon">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto p-4 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold">Your API Keys</h2>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add New Key
                        </Button>
                    </div>

                    {fetchError && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6 flex items-center gap-4">
                            <AlertTriangle className="h-6 w-6" />
                            <div>
                                <h3 className="font-bold">Connection Error</h3>
                                <p className="text-sm">{fetchError}</p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {apiKeys.length > 0
                                ? apiKeys.map((key) => (
                                    <ApiKeyCard
                                        key={key.id}
                                        apiKey={key}
                                        onDelete={handleDeleteKey}
                                    />
                                ))
                                : !fetchError && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full text-center py-16 text-muted-foreground"
                                    >
                                        You haven&apos;t added any API keys yet.
                                    </motion.div>
                                )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            <AddKeyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddKey={handleAddKey}
            />
        </>
    );
}
