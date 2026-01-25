"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, RefreshCw } from "lucide-react";

export const LanguageToggle = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "en" ? "de" : "en";

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-border bg-accent px-2 cursor-pointer py-1 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-accent/20"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Rotating Globe Icon */}
      <Globe className="h-4 w-4 text-muted-foreground transition-transform duration-500 group-hover:rotate-180 group-hover:text-primary" />

      {/* Text Container with AnimatePresence for smooth swapping */}
      <div className="relative h-4 w-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={locale}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-wider uppercase"
          >
            {locale}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
};
