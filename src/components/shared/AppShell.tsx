"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

interface AppShellProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

const navLinks = [
  { href: "/results", label: "Results" },
  { href: "/playbook", label: "Playbook" },
];

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-blair-linen">
      <nav className="border-b border-blair-mist bg-blair-linen/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/results" className="shrink-0">
              <Logo />
            </Link>

            {/* Center nav links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "bg-blair-sage/10 text-blair-sage-dark"
                      : "text-blair-charcoal/60 hover:text-blair-charcoal hover:bg-blair-mist/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User area */}
            <div className="flex items-center gap-3">
              {user?.email && (
                <span className="hidden sm:block text-sm text-blair-charcoal/50 truncate max-w-[180px]">
                  {user.email}
                </span>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-blair-charcoal/50 transition-colors hover:text-blair-charcoal hover:bg-blair-mist/50"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
