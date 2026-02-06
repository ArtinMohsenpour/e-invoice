"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/Auth";
import { Menu, X, User } from "lucide-react";
import { logoutAction } from "@/app/[locale]/(frontend)/actions/auth";
import { useTranslations } from "next-intl";
import { MobileMenuProps } from "@/lib/types";

export const MobileMenu: React.FC<MobileMenuProps> = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const t = useTranslations("Navbar");

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full border-t border-border bg-background shadow-lg md:hidden">
          <div className="px-4 py-4 space-y-4">
            {/* Nav Items */}
            <div className="flex flex-col gap-4">
              {navItems?.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {item.type === "single" && item.link ? (
                    <Link
                      href={item.link}
                      onClick={handleLinkClick}
                      className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
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
                          onClick={handleLinkClick}
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
                      <p className="text-xs text-muted-foreground truncate max-w-37.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/account"
                      onClick={handleLinkClick}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("manage")}
                    </Link>
                    <button
                      onClick={() => {
                        if (user?.id) {
                           try {
                              window.sessionStorage.removeItem(`payload-prefs-synced-${user.id}`);
                           } catch (e) {
                              // ignore
                           }
                        }
                        logoutAction();
                        handleLinkClick();
                      }}
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
                    onClick={handleLinkClick}
                    className="flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={handleLinkClick}
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
    </>
  );
};
