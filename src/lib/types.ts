import { User, Header, Organization } from "@/payload-types";
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

// Profile Types
export interface ProfileClientProps {
  user: User;
  organization: Organization | null;
}

// UI Component Types
export interface CountrySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}
