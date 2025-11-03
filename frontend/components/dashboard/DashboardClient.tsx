"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Loader2, Search, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddKeyModal } from "./AddKeyModal";
import { AddProxyModal } from "./AddProxyModal";
import { UserNav } from "./UserNav";
import { Sidebar } from "./Sidebar";
import { ApiKeysView } from "./ApiKeysView";
import { ProxyKeysView } from "./ProxyKeysView";
import type { ApiKey, ApiKeyInput, ProxyKey } from "../../lib/types";

interface DashboardClientProps {
  initialApiKeys: {
    data: ApiKey[];
    nextCursor: string | null;
    hasMore: boolean;
  };
  accessToken: string;
  fetchError: string | null;
  username: string;
}

function DashboardClientContent({
  initialApiKeys,
  accessToken,
  fetchError,
  username,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [isAddProxyModalOpen, setIsAddProxyModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys.data);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialApiKeys.nextCursor
  );
  const [hasMore, setHasMore] = useState(initialApiKeys.hasMore);
  const [proxyKeys, setProxyKeys] = useState<ProxyKey[]>([]);
  const [proxyFetchError, setProxyFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [noResults, setNoResults] = useState(false);

  const currentView =
    searchParams.get("view") === "proxy_keys" ? "proxy_keys" : "api_keys";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProxyKeys = async () => {
      if (currentView === "proxy_keys") {
        setProxyFetchError(null);
        try {
          const response = await fetch(`${apiUrl}/api/proxy/keys`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch proxy keys: ${response.statusText}`
            );
          }

          const data = await response.json();
          setProxyKeys(data.data || []);
        } catch (error: any) {
          console.error("Error fetching proxy keys:", error);
          setProxyFetchError(error.message);
        }
      }
    };

    fetchProxyKeys();
  }, [currentView, accessToken, apiUrl]);

  const fetchMoreKeys = async () => {
    if (!hasMore || !nextCursor) return;

    try {
      const response = await fetch(`${apiUrl}/api/key/keys?cursor=${nextCursor}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch more keys: ${response.statusText}`);
      }

      const data = await response.json();
      setApiKeys((prevKeys) => {
        const existingKeyIds = new Set(prevKeys.map((key) => key.id));
        const newKeys = data.data.filter(
          (key: ApiKey) => !existingKeyIds.has(key.id)
        );
        return [...prevKeys, ...newKeys];
      });
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error: any) {
      console.error("Error fetching more keys:", error);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchMoreKeys();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreKeys]);

  const handleAddKey = async (newKeyData: ApiKeyInput) => {
    setModalError(null);
    try {
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

      const addedKey = await response.json();
      setApiKeys((prevKeys) => [...prevKeys, addedKey]);
      setIsAddKeyModalOpen(false);
      setModalError(null);
    } catch (error: any) {
      console.error("Error adding key:", error);
      setModalError(error.message);
    }
  };

  const handleEditKey = async (keyId: string, newKeyData: ApiKeyInput) => {
    setModalError(null);
    try {
      const response = await fetch(`${apiUrl}/api/key/key/${keyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newKeyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update key");
      }

      const updatedKey = await response.json();
      setApiKeys((prevKeys) =>
        prevKeys.map((key) => (key.id === keyId ? updatedKey : key))
      );
    } catch (error: any) {
      console.error("Error updating key:", error);
      setModalError(error.message);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    const originalApiKeys = [...apiKeys];
    const newApiKeys = apiKeys.filter((key) => key.id !== keyId);
    setApiKeys(newApiKeys);

    if (isSearchActive && newApiKeys.length === 0) {
      setNoResults(true);
    }

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
    } catch (error: any) {
      console.error("Error deleting key:", error);
      setApiKeys(originalApiKeys);
      if (isSearchActive && newApiKeys.length === 0) {
        setNoResults(false);
      }
    }
  };

  const handleAddProxy = async (proxyData: any) => {
    console.log("Creating proxy...", proxyData);
    setModalError(null);
    setIsAddProxyModalOpen(false);
  };

  const handleGenerateProxy = (apiKey: ApiKey) => {
    setIsAddProxyModalOpen(true);
  };

  const openAddKeyModal = () => {
    setIsAddKeyModalOpen(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setIsSearchActive(true);
    setNoResults(false);
    try {
      const response = await fetch(`${apiUrl}/api/key/keys/search?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search keys: ${response.statusText}`);
      }

      const data = await response.json();
      setApiKeys(data.data);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
      if (data.data.length === 0) {
        setNoResults(true);
      }
    } catch (error: any) {
      console.error("Error searching keys:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    setNoResults(false);
    if (isSearchActive) {
      setIsSearchActive(false);
      setIsSearching(true);
      try {
        const response = await fetch(`${apiUrl}/api/key/keys`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch keys: ${response.statusText}`);
        }

        const data = await response.json();
        setApiKeys(data.data);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error: any) {
        console.error("Error fetching keys after clearing search:", error);
        setApiKeys([]);
        setNextCursor(null);
        setHasMore(false);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full dark-dotted-background">
        <div className="hidden md:block md:w-64 bg-zinc-950/80 backdrop-blur-md border-r border-zinc-700">
          <div className="flex h-16 items-center border-b border-zinc-700 px-6">
            <h1 className="text-xl font-bold text-zinc-100">Wombat Vault</h1>
          </div>
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-700 md:border-b-0">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
              <h1 className="text-xl font-bold text-zinc-100 md:hidden">
                Wombat Vault
              </h1>
              <div className="flex-1 flex justify-center px-4">
                <form onSubmit={handleSearch} className="w-full max-w-md relative">
                  <Input
                    placeholder="Search API keys..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-800/50 border-zinc-700 pr-10"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-400 hover:bg-zinc-700"
                      onClick={clearSearch}
                      disabled={isSearching}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-400 hover:bg-zinc-700"
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
              <div className="flex items-center gap-4">
                <UserNav username={username} />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto relative">
            {currentView === "api_keys" ? (
              <ApiKeysView
                apiKeys={apiKeys}
                fetchError={fetchError}
                onDeleteKey={handleDeleteKey}
                onEditKey={handleEditKey}
                onGenerateProxy={handleGenerateProxy}
                hasMore={hasMore}
                accessToken={accessToken}
                isSearching={isSearching}
                noResults={noResults}
              />
              ) : (
                <ProxyKeysView
                  proxyKeys={proxyKeys}
                  fetchError={proxyFetchError}
                />
              )}

              {currentView === "api_keys" && (
                <motion.div
                  className="fixed bottom-8 right-8 z-20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5,
                  }}
                >
                  <Button
                    size="lg"
                    variant="default"
                    className="rounded-full shadow-lg h-14 w-auto px-5 border border-zinc-700 bg-zinc-900 hover:bg-violet-900 cursor-pointer"
                    onClick={openAddKeyModal}
                  >
                    <Plus className="mr-2 h-5 w-5" /> Add API Key
                  </Button>
                </motion.div>
              )}
            </main>
          </div>
        </div>

        <AddKeyModal
          isOpen={isAddKeyModalOpen}
          onClose={() => {
            setIsAddKeyModalOpen(false);
            setModalError(null);
          }}
          onAddKey={handleAddKey}
          apiError={modalError}
        />
        <AddProxyModal
          isOpen={isAddProxyModalOpen}
          onClose={() => {
            setIsAddProxyModalOpen(false);
            setModalError(null);
          }}
          onAddProxy={handleAddProxy}
          apiError={modalError}
        />
      </>
    );
}

export function DashboardClient(props: DashboardClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClientContent {...props} />
    </Suspense>
  );
}

