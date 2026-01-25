"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    // Check initially to prevent flash of wrong style if loaded scrolled down
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "border-border bg-background/95"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </nav>
  );
};
