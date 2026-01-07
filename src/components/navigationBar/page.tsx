"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogOut, User } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { profile, signOut } = useAuthStore();
  const pathname = usePathname();

  const handleSignOut = async () => {
    signOut();
    await signOutAction();
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-foreground">
            E-Invoice
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={cn(
              "text-sm px-4 py-2 rounded-md  hover:bg-muted-foreground/20 font-medium transition-colors hover:text-foreground",
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Home
          </Link>

          {profile ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm px-4 py-2 rounded-md hover:bg-muted-foreground/20 hover:text-white font-medium text-muted-foreground  transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm px-4 py-2 cursor-pointer rounded-md hover:bg-muted-foreground/20 font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/auth/login"
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted-foreground/20 hover:text-white"
                )}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/auth/signup"
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted-foreground/20 hover:text-white"
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
