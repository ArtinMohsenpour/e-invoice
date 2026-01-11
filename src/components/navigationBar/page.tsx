"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogOut, User, LayoutDashboard, FileText, ChevronRight, Globe } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";

const NavLink = ({
  href,
  children,
  icon: Icon,
  active
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean
}) => (
  <Link
    href={href}
    className={cn(
      "group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
      active
        ? "bg-primary/10 text-primary hover:bg-primary/15"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
    {children}
  </Link>
);

function MobileNav() {
  const { profile, signOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    signOut();
    await signOutAction();
    router.replace("/");
  };

  const onSelectChange = (nextLocale: string) => {
    let cleanPath = pathname;
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') cleanPath = cleanPath.replace(/^\/en(\/|$)/, '/');
    if (cleanPath.startsWith('/de/') || cleanPath === '/de') cleanPath = cleanPath.replace(/^\/de(\/|$)/, '/');
    if (cleanPath === '') cleanPath = '/';

    startTransition(() => {
      router.replace(cleanPath, { locale: nextLocale });
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
       document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="md:hidden flex items-center max-h-fit">
        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          toggle={toggleMobileMenu}
        />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "bg-background opacity-100 visible"
            : "bg-transparent opacity-0 invisible pointer-events-none"
        )}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col h-full p-6 space-y-8 overflow-y-auto pb-24">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className={cn(
                "flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-colors border border-transparent",
                pathname === "/"
                  ? "bg-primary/5 text-primary border-primary/10"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                {t("home")}
              </div>
              {pathname === "/" && <ChevronRight className="w-5 h-5" />}
            </Link>
            
            {profile && (
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-colors border border-transparent",
                  pathname.includes("/dashboard")
                    ? "bg-primary/5 text-primary border-primary/10"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  {t("dashboard")}
                </div>
                {pathname.includes("/dashboard") && <ChevronRight className="w-5 h-5" />}
              </Link>
            )}
          </div>

          <div className="h-px w-full bg-border/50" />

          <div className="flex flex-col space-y-6">
             <div className="flex items-center justify-between p-4 rounded-xl text-lg font-medium border border-transparent text-foreground hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <span>Language</span>
                </div>
                <div className="flex items-center gap-2">
                     <button 
                       onClick={() => onSelectChange("en")} 
                       className={cn("transition-colors", locale === 'en' ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground")}
                     >
                       EN
                     </button>
                     <span className="text-muted-foreground">/</span>
                     <button 
                       onClick={() => onSelectChange("de")} 
                       className={cn("transition-colors", locale === 'de' ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground")}
                     >
                       DE
                     </button>
                </div>
             </div>

             <div className="flex flex-col space-y-3 pt-2">
                {profile ? (
                   <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-medium border border-red-100"
                   >
                     <LogOut className="w-5 h-5" />
                     {t("logout")}
                   </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/auth/login"
                      className={cn(
                        "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all font-medium",
                        pathname === "/auth/login"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/20 hover:bg-muted"
                      )}
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className={cn(
                        "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all font-medium",
                        pathname === "/auth/signup"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/20 hover:bg-muted"
                      )}
                    >
                      {t("signup")}
                    </Link>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const { profile, signOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const [isPending, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    signOut();
    await signOutAction();
    router.replace("/");
  };

  const onSelectChange = (nextLocale: string) => {
    let cleanPath = pathname;
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') cleanPath = cleanPath.replace(/^\/en(\/|$)/, '/');
    if (cleanPath.startsWith('/de/') || cleanPath === '/de') cleanPath = cleanPath.replace(/^\/de(\/|$)/, '/');
    if (cleanPath === '') cleanPath = '/';

    startTransition(() => {
      router.replace(cleanPath, { locale: nextLocale });
    });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                E-Invoice
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={pathname === "/"}>
              {t("home")}
            </NavLink>
            {profile && (
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                active={pathname.includes("/dashboard")}
              >
                {t("dashboard")}
              </NavLink>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-muted/50 rounded-full p-1 border border-border/50">
              <button
                onClick={() => onSelectChange("en")}
                disabled={isPending}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  locale === "en"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => onSelectChange("de")}
                disabled={isPending}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  locale === "de"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                DE
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 pl-2">
              {profile ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-25">
                      {profile.company_name || "Account"}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                    title={t("logout")}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    {t("signup")}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation (Keyed by pathname to reset state) */}
          <MobileNav key={pathname} />
        </div>
      </div>
    </nav>
  );
}
