import { getLocale } from "next-intl/server";
import { getHeader } from "@/data/header";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { AuthStatus } from "./AuthStatus";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

import { NavbarWrapper } from "./NavbarWrapper";

export const Navbar = async () => {
  const locale = await getLocale();
  const headerData = await getHeader(locale);

  return (
    <NavbarWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Logo data={headerData} />

          {/* Desktop Navigation */}
          <DesktopNav navItems={headerData.navItems} />

          {/* Right Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <AuthStatus />
          </div>

          {/* Mobile Actions & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <MobileMenu navItems={headerData.navItems} />
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
};
