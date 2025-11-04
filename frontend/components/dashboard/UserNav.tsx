"use client"

import { LogOut, User as UserIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps {
  username: string;
}

export function UserNav({ username }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!username) {
    return (
      <Button
        variant="ghost"
        disabled
        className="relative flex h-10 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/50 px-3 py-2 text-sm font-medium text-zinc-100"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
        <span className="hidden sm:inline-block">Loading...</span>
      </Button>
    )
  }

  // Get initials for the avatar fallback
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* This is the "box" you requested, styled as a pill button */}
        <Button
          variant="ghost"
          className="relative flex h-10 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/50 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[state=open]:bg-zinc-800 cursor-pointer"
        >
          {/* Avatar / Logo */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold">
            {initials}
          </div>
          {/* Username */}
          <span className="hidden sm:inline-block">{username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-zinc-100">
              {username}
            </p>
            {/* You can add user email here later if needed */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push('/profile')} // We can create this page next
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-400 hover:!text-red-400 focus:!bg-red-500/10 focus:!text-red-400"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

