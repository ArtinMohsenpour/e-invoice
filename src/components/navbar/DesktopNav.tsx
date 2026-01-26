"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";
import { DesktopNavProps } from "@/lib/types";

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const pathname = usePathname();
  const isActive = (path: string | null | undefined) => {
    if (!path) return false;
    // Normalize: ensure leading slash, remove trailing slash (unless root)
    const normalize = (p: string) => {
      const withLeading = p.startsWith("/") ? p : `/${p}`;
      return withLeading.length > 1 && withLeading.endsWith("/")
        ? withLeading.slice(0, -1)
        : withLeading;
    };
    return normalize(pathname) === normalize(path);
  };

  return (
    <div className="hidden md:flex md:items-center md:gap-6">
      {navItems?.map((item, i) => (
        <div key={i} className="relative group">
          {item.type === "single" && item.link ? (
            <Link
              href={item.link.startsWith("/") ? item.link : `/${item.link}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.link) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ) : item.type === "dropdown" && item.subMenu ? (
            <div className="relative">
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary text-muted-foreground`}
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
  );
};
