"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, FileText, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [signedIn, setSignedIn] = useState(false); // whether user is signed in
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Try to detect signed-in state. Adjust endpoint to match your API.
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        // If you have an endpoint that returns current user, use it here.
        // Example: GET /api/auth/me -> returns 200 + user JSON when logged in, 401/204 when not.
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        if (!isMounted) return;
        if (res.ok) {
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      } catch (err) {
        // network error or endpoint missing -> assume not signed in
        setSignedIn(false);
      } finally {
        if (isMounted) setLoadingAuth(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // Logout handler calls your POST /api/auth/logout route and then redirects.
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // If you want to clear any client state, do it here
        setSignedIn(false);
        // Navigate to homepage or login page
        router.push("/login");
        // Optionally refresh current layout: router.refresh();
      } else {
        console.error("Logout failed", await res.text());
        // still try to redirect/refresh
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout error", err);
      router.push("/login");
    }
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <FileText size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">DocRemind</h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Show logout only when signed in */}
              {!loadingAuth && signedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full cursor-pointer"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              )}
            </>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </header>
  );
}
