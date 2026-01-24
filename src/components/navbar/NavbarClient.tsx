"use client";

import React, { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/Auth";
import { Moon, Sun, Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { logoutAction } from "@/app/[locale]/(frontend)/actions/auth";
import { HeaderData } from "@/lib/payload-utils";

interface NavbarClientProps {
  data: HeaderData;
}

export const NavbarClient: React.FC<NavbarClientProps> = ({ data }) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "de" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const isActive = (path: string) => pathname === path;

  // Helper to resolve logo URL
  const logoUrl =
    data.logo && typeof data.logo !== "string" ? data.logo.url : null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Company Name */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={data.companyName || "Logo"}
                  className="h-10 w-10 object-contain"
                />
              )}
              {data.companyName && (
                <span className="font-bold text-xl text-foreground tracking-tight">
                  {data.companyName}
                </span>
              )}
              {!logoUrl && !data.companyName && (
                <span className="font-bold text-xl text-foreground tracking-tight">
                  Faktura
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {data.navItems?.map((item, i) => (
              <div key={i} className="relative group">
                {item.type === "single" && item.link ? (
                  <Link
                    href={item.link}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.link)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : item.type === "dropdown" && item.subMenu ? (
                  <div className="relative">
                    <button
                      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${"text-muted-foreground"}`}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                      <div className="p-2 bg-popover border border-border rounded-md shadow-md">
                        {item.subMenu.map((subItem, j) => (
                          <Link
                            key={j}
                            href={subItem.url}
                            className="block px-3 py-2 text-sm text-popover-foreground rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle language"
            >
              <span className="text-xs font-bold">{locale.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            {mounted ? (
              <button
                onClick={toggleTheme}
                className="relative cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={t("theme")}
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
                <Link
                  href="/account"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  title={t("account")}
                >
                  <User className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => logoutAction()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  title={t("logout")}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground"
            >
              <span className="text-xs font-bold">{locale.toUpperCase()}</span>
            </button>

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
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
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

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            {/* Nav Items */}
            <div className="flex flex-col gap-4">
              {data.navItems?.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {item.type === "single" && item.link ? (
                    <Link
                      href={item.link}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.link)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      {item.subMenu?.map((sub, j) => (
                        <Link
                          key={j}
                          href={sub.url}
                          className="pl-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth Actions (Mobile) */}
            <div className="border-t border-border pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {t("account")}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/account"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("manage")}
                    </Link>
                    <button
                      onClick={() => logoutAction()}
                      className="text-sm font-medium text-muted-foreground hover:text-destructive"
                    >
                      {t("logout")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
