"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export const LanguageToggle = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "de" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle language"
    >
      <span className="text-xs font-bold">{locale.toUpperCase()}</span>
    </button>
  );
};
