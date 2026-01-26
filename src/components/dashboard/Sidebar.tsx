"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { SidebarProps } from "@/lib/types";

export function Sidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const activeItem =
    navItems.find(
      (item) =>
        pathname === item.link ||
        (item.link !== "/dashboard" && pathname.startsWith(item.link)),
    ) || navItems[0];

  const SidebarContent = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 min-[1920px]:text-base">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.link ||
              (item.link !== "/dashboard" && pathname.startsWith(item.link));

            return (
              <Link
                key={item.link + index}
                href={item.link}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.icon.url && (
                  <div className="relative h-6 w-6 min-[1920px]:h-8 min-[1920px]:w-8">
                    <Image
                      src={item.icon.url}
                      alt={item.icon.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {user && (
        <div className="mt-auto border-t items-center px-4 pt-4 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 min-[1920px]:h-10 min-[1920px]:w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-xs font-medium text-muted-foreground min-[1920px]:text-sm">
                {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium min-[1920px]:text-base">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.email || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground min-[1920px]:text-sm">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Trigger - Positioned below the main navbar (top-14) */}
      <div className="fixed top-14 left-0 z-30 w-full border-b bg-background lg:hidden">
        <button
          type="button"
          className="flex h-14 w-full items-center justify-between px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="font-semibold text-lg">
            {activeItem?.label || "Dashboard"}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Mobile Dropdown */}
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <SidebarContent className="pb-4 pt-2" />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Fixed below the main navbar */}
      <div className="hidden border-r bg-card lg:fixed lg:top-14 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <SidebarContent className="h-full pt-7" />
      </div>
    </>
  );
}
