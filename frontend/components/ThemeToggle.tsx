'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  // after the component has mounted.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Until the component is mounted, we can render a placeholder or null
  // to avoid a hydration mismatch.
  if (!mounted) {
    return <div className="w-10 h-10" /> // Renders an empty space of the same size
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? 
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" /> : 
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      }
    </Button>
  )
}

