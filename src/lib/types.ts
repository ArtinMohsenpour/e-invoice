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

// Team Types
export interface TeamMember {
  id: string | number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  orgRole?: "owner" | "manager" | "accountant" | "user" | string | null;
  [key: string]: any;
}

export interface Invitation {
  id: string | number;
  email: string;
  orgRole?: "manager" | "accountant" | null;
  token?: string | null;
  status?: "pending" | "accepted" | "expired" | null;
  organization: any;
}

export interface TeamClientProps {
  currentUser: TeamMember;
  members: TeamMember[];
  invitations: Invitation[];
}

// Profile Form Types
export interface UserProfileFormProps {
  user: User;
}

export interface OrganizationFormProps {
  user: User;
  organization: Organization | null;
}

// UI Component Toast & Success Types
export interface ToastNotificationProps {
  message: string;
  type: "success" | "error";
}

export interface SaveSuccessIndicatorProps {
  isVisible: boolean;
  message: string;
}
