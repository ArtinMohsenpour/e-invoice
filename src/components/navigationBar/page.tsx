"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogOut, User, Globe } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations, useLocale } from "next-intl";
import { useTransition } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { profile, signOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    signOut();
    await signOutAction();
  };

  const onSelectChange = (nextLocale: string) => {
    // Robustly handle pathname: strict strip of existing locale prefix if present
    let cleanPath = pathname;
    if (cleanPath.startsWith("/en/") || cleanPath === "/en")
      cleanPath = cleanPath.replace(/^\/en(\/|$)/, "/");
    if (cleanPath.startsWith("/de/") || cleanPath === "/de")
      cleanPath = cleanPath.replace(/^\/de(\/|$)/, "/");
    if (cleanPath === "") cleanPath = "/";

    startTransition(() => {
      router.replace(cleanPath, { locale: nextLocale });
    });
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
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
            {t("home")}
          </Link>

          {profile ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm px-4 py-2 rounded-md hover:bg-muted-foreground/20 hover:text-white font-medium text-muted-foreground  transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t("dashboard")}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm px-4 py-2 cursor-pointer rounded-md hover:bg-muted-foreground/20 font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
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
                {t("login")}
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
                {t("signup")}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-1 border-l pl-4 ml-2 border-border/50">
            <Globe className="w-4 h-4 text-muted-foreground mr-1" />
            <button
              onClick={() => onSelectChange("en")}
              disabled={isPending}
              className={cn(
                "text-xs px-2 py-1 rounded-sm font-medium transition-colors",
                locale === "en"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              EN
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button
              onClick={() => onSelectChange("de")}
              disabled={isPending}
              className={cn(
                "text-xs px-2 py-1 rounded-sm font-medium transition-colors",
                locale === "de"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              DE
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
