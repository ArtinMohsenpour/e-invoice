import type React from "react";
import { getMeUser } from "@/app/[locale]/(frontend)/actions/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getDashboardNav } from "@/data/dashboard-nav";
import { UserPreferencesSync } from "@/components/UserPreferencesSync";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as unknown as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const navData = await getDashboardNav(locale);

  const user = await getMeUser();

  const navItems =
    navData.navItems?.map((item) => {
      let href = item.link.trim();

      if (href === "/") {
        href = "/dashboard";
      } else if (href !== "/dashboard" && !href.startsWith("/dashboard/")) {
        // remove leading slash if present to avoid double slash
        const cleanPath = href.replace(/^\//, "");
        href = `/dashboard/${cleanPath}`;
      }

      const iconMedia =
        item.icon && typeof item.icon === "object" ? item.icon : null;

      return {
        label: item.label,
        link: href,
        icon: {
          url: iconMedia?.url || "",
          alt: iconMedia?.alt || item.label,
        },
      };
    }) || [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background lg:flex-row">
      <UserPreferencesSync user={user} />
      <Sidebar user={user} navItems={navItems} />

      <div className="flex flex-col w-full lg:pl-64">
        {/* Mobile header spacer - sidebar covers top 14 (3.5rem) on mobile */}

        <div className="h-14 lg:hidden" />

        <main className="flex-1 p-4 sm:px-6 sm:py-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
