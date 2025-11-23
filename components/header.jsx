'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, FileText } from 'lucide-react'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">DocRemind</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </Button>
      </div>
    </header>
  )
}
