"use client";

import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export function MobileMenuButton({ isOpen, toggle, className }: MobileMenuButtonProps) {
  return (
    <button
      onClick={toggle}
      className={cn(
        "relative flex flex-col justify-center items-center w-10 h-10 space-y-[6px] focus:outline-none z-50 group",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span
        className={cn(
          "block w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out transform origin-center",
          isOpen ? "rotate-45 translate-y-[8px]" : "group-hover:scale-x-110"
        )}
      />
      <span
        className={cn(
          "block w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out",
          isOpen ? "opacity-0 translate-x-2" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "block w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out transform origin-center",
          isOpen ? "-rotate-45 -translate-y-[8px]" : "group-hover:scale-x-110"
        )}
      />
    </button>
  );
}
