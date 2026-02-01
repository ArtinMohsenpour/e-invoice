"use client";

import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import type { User } from "@/payload-types";

export function UserPreferencesSync({ user }: { user: User | null }) {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    // Sync Theme
    if (user.theme && user.theme !== "system" && user.theme !== theme) {
      setTheme(user.theme);
    }

    // Sync Language
    if (user.language && user.language !== locale) {
       router.replace(pathname, { locale: user.language as "en" | "de" });
    }
    
  }, [user, theme, mounted, setTheme, locale, pathname, router]);

  return null; 
}