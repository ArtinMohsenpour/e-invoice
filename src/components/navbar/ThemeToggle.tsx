"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Navbar");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-14 rounded-full bg-muted animate-pulse" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    // Set a cookie so the server knows the theme on the next request (language change)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-6 w-12 max-w-[51px] cursor-pointer items-center rounded-full p-0.5 transition-colors duration-500 shadow-inner bg-accent"
      aria-label={t("theme")}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <Moon
          className={`h-3.5 w-4 transition-opacity duration-500 ${
            isDark ? "opacity-100 text-secondary-foreground" : "opacity-0"
          }`}
        />
        <Sun
          className={`h-3.5 w-4 transition-opacity duration-500 ${
            isDark ? "opacity-0" : "opacity-100 text-secondary-foreground"
          }`}
        />
      </div>

      {/* The Sliding Knob */}
      <motion.div
        className="z-10 h-5 w-5 rounded-full bg-background shadow-sm flex items-center justify-center"
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
          rotate: isDark ? 360 : 0,
        }}
        whileTap={{ scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 15,
        }}
      >
        {/* Decorative inner element */}
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-ring"
          animate={{ scale: isDark ? 1 : 0.8 }}
        />
      </motion.div>
    </button>
  );
};
