"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/Auth";
import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/app/[locale]/(frontend)/actions/auth";
import { useTranslations } from "next-intl";

export const AuthStatus = () => {
  const { user } = useAuth();
  const t = useTranslations("Navbar");

  if (user === undefined) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 pl-2 border-l border-border">
        <Link
          href="/account"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-secondary-foreground hover:bg-accent-foreground/20 transition-colors"
          title={t("account")}
        >
          <User className="h-4 w-4" />
        </Link>

        <button
          onClick={() => logoutAction()}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title={t("logout")}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
      >
        {t("login")}
      </Link>
      <Link
        href="/signup"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary/80 px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-secondary/90 transition-colors"
      >
        {t("signup")}
      </Link>
    </div>
  );
};
