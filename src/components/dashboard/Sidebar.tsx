"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { isLinkActive } from "@/lib/nav-utils";
import type { SidebarProps } from "@/lib/types";

// Extracted for performance to prevent re-renders of the list when Sidebar state changes
function NavLinks({ items, pathname }: { items: SidebarProps["navItems"]; pathname: string }) {
  return (
    <nav className="flex flex-col gap-1 px-2 text-sm font-medium lg:px-4">
      {items.map((item, index) => {
        // Use the centralized robust logic for active state
        const isActive = isLinkActive(pathname, item.link);
        
        return (
          <Link
            key={item.link + index}
            href={item.link}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon.url ? (
              <div className="relative h-5 w-5 shrink-0">
                <Image
                  src={item.icon.url}
                  alt={item.icon.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function UserProfile({ user }: { user: SidebarProps["user"] }) {
  if (!user) return null;

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.email || "User";
    
  const initial = (user.firstName?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();

  return (
    <div className="mt-auto border-t p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {initial}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
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

  const activeItem = navItems.find((item) => isLinkActive(pathname, item.link));

  return (
    <>
      {/* Mobile Trigger */}
      <div className="fixed left-0 top-14 z-30 w-full border-b bg-background lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-full items-center justify-between px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <div className="flex items-center gap-3">
            <Menu className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">
              {activeItem?.label || "Dashboard"}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* CSS Grid Animation Trick for smooth height transition */}
        <div
          className={`grid border-b bg-background transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="py-4">
              <NavLinks items={navItems} pathname={pathname} />
              <div className="mt-4 px-2">
                 <UserProfile user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:fixed lg:bottom-0 lg:left-0 lg:top-14 lg:flex lg:z-30">
        <div className="flex flex-1 flex-col gap-4 py-6">
          <NavLinks items={navItems} pathname={pathname} />
          <UserProfile user={user} />
        </div>
      </aside>
    </>
  );
}