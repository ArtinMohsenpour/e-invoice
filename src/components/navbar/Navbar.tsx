"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/Auth";
import {
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  User,
} from "lucide-react";

export const Navbar = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-foreground tracking-tight">
                Faktura
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            {user && (
              <Link
                href="/invoices"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/invoices")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Invoices
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            {mounted ? (
              <button
                onClick={toggleTheme}
                className="relative cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-yellow-500" />
                <Moon className="absolute h-4 w-4 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-blue-400" />
              </button>
            ) : (
              <div className="h-9 w-9 rounded-md border border-input bg-transparent" />
            )}

            {/* Auth State */}
            {user === undefined ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                <span className="text-sm font-medium text-foreground hidden lg:inline-block">
                  {user.email}
                </span>
                <Link
                  href="/account"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  title="Account"
                >
                  <User className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground"
              >
                <Sun className="h-4 w-4 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-4 w-4 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            {user && (
              <Link
                href="/invoices"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="h-4 w-4" />
                Invoices
              </Link>
            )}
          </div>
          <div className="border-t border-border px-4 py-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Account</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
