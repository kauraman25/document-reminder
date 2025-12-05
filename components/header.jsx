"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <FileText size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">DocRemind</h1>
          </Link>{" "}
        </div>
        <div className="flex items-center gap-2">
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full cursor-pointer"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </header>
  );
}
