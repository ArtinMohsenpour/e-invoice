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
    // Wait for mount and user data
    if (!mounted || !user) return;

    // specific key for this user to allow re-sync if switching accounts
    const storageKey = `payload-prefs-synced-${user.id}`;

    // If we have already synced for this session, do not force it again.
    // This allows the user to manually change language/theme in the navbar
    // without being redirected back to their database preference on every route change.
    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    let hasChanged = false;

    // Sync Theme
    if (user.theme && user.theme !== "system" && user.theme !== theme) {
      setTheme(user.theme);
      hasChanged = true;
    }

    // Sync Language
    if (user.language && user.language !== locale) {
       router.replace(pathname, { locale: user.language as "en" | "de" });
       hasChanged = true;
    }
    
    // Mark as synced immediately.
    // Even if no change was needed (e.g. user pref matches default),
    // we consider the "sync check" done for this session.
    window.sessionStorage.setItem(storageKey, 'true');
    
  }, [user, mounted, theme, setTheme, locale, pathname, router]);

  return null; 
}