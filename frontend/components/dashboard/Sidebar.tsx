"use client";

import { useSearchParams } from "next/navigation";
import { KeyRound, ShieldHalf } from "lucide-react";
import { cn } from "../../lib/utils/utils";
import { Button } from "../ui/button";

interface SidebarProps {
  onViewChange: (view: string) => void;
  isViewChanging: boolean;
}

export function Sidebar({ onViewChange, isViewChanging }: SidebarProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "api_keys";

  const navItems = [
    {
      name: "API Keys",
      view: "api_keys",
      icon: KeyRound,
    },
    {
      name: "Proxy Keys",
      view: "proxy_keys",
      icon: ShieldHalf,
    },
  ];

  return (
    <nav className="flex flex-col gap-2 p-4 pt-6">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <Button
            key={item.name}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "flex items-center justify-start gap-3 rounded-md px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer",
              isActive && "bg-zinc-800 text-zinc-50"
            )}
            onClick={() => onViewChange(item.view)}
            disabled={isViewChanging}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        );
      })}
    </nav>
  );
}


