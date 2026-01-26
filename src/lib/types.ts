import { User, Header } from "@/payload-types";
import { ReactNode } from "react";

// Dashboard / Sidebar Types
export type SidebarNavItem = {
  label: string;
  link: string;
  icon: {
    url: string;
    alt: string;
  };
};

export interface SidebarProps {
  user: User | null;
  navItems: SidebarNavItem[];
}

// Navbar Types
export interface MobileMenuProps {
  navItems: Header["navItems"];
}

export interface DesktopNavProps {
  navItems: Header["navItems"];
}

export interface LogoProps {
  data: Header;
}

