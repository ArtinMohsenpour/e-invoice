"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Link, usePathname } from "@/i18n/routing";
import type { User } from "@/payload-types";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";

type NavItem = {
  label: string;
  link: string;
  icon: {
    url: string;
    alt: string;
  };
};

type SidebarProps = {
  user: User | null;
  navItems: NavItem[];
};

export function Sidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 pt-7">
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
                  <div className="relative h-6 w-6">
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
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-xs font-medium text-muted-foreground">
                {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.email || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
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
      <div className="fixed top-14 left-0 z-30 flex h-14 w-full items-center border-b bg-background px-4 lg:hidden">
        <button
          type="button"
          className="mr-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <span className="font-semibold">Dashboard</span>
      </div>

      {/* Desktop Sidebar - Fixed below the main navbar */}
      <div className="hidden border-r bg-card lg:fixed lg:top-14 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 transition-opacity"
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(false)}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") setIsOpen(false);
            }}
          >
            <span className="sr-only">Close sidebar</span>
          </div>

          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background pt-5 pb-4 transition ease-in-out duration-300 transform translate-x-0">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
