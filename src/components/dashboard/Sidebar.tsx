"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { SidebarProps } from "@/lib/types";
import { isLinkActive } from "@/lib/nav-utils";

// Extracted NavLinks component to prevent re-renders
function NavLinks({ 
  navItems, 
  pathname, 
  onLinkClick 
}: { 
  navItems: SidebarProps["navItems"]; 
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 min-[1920px]:text-base">
      {navItems.map((item, index) => {
        const isActive = isLinkActive(pathname, item.link);

        return (
          <Link
            key={item.link + index}
            href={item.link}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
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
  );
}

// User Profile Section Component
function UserProfile({ user }: { user: SidebarProps["user"] }) {
  if (!user) return null;

  return (
    <div className="mt-auto border-t items-center px-4 pt-4 md:mb-10">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 min-[1920px]:h-10 min-[1920px]:w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-xs font-medium text-muted-foreground min-[1920px]:text-sm">
            {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
          </span>
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
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
  );
}

export function Sidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const activeItem = navItems.find((item) => isLinkActive(pathname, item.link)) || navItems[0];

  return (
    <>
      {/* Mobile Trigger - Positioned below the main navbar (top-14) */}
      <div className="fixed top-14 left-0 z-30 w-full border-b bg-background lg:hidden">
        <button
          type="button"
          className="flex h-14 w-full items-center justify-between px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            <span className="font-semibold text-lg">
              {activeItem?.label || "Dashboard"}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Mobile Dropdown with CSS Grid Animation */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out border-b bg-background shadow-sm",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-4 pb-4 pt-2">
              <NavLinks 
                navItems={navItems} 
                pathname={pathname} 
                onLinkClick={() => setIsOpen(false)}
              />
              <UserProfile user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Fixed below the main navbar */}
      <aside className="hidden border-r bg-card lg:fixed lg:top-14 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <div className="flex flex-col h-full gap-4 pt-7">
          <div className="flex-1 overflow-y-auto">
            <NavLinks navItems={navItems} pathname={pathname} />
          </div>
          <UserProfile user={user} />
        </div>
      </aside>
    </>
  );
}