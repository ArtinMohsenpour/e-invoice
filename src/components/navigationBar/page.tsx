"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogOut, User } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export default function Navbar() {
  const { profile, signOut } = useAuthStore();

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
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>

          {profile ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600/20 rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-slate-900"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
