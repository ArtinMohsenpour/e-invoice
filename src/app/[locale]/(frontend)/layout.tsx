import type React from "react";
import { AuthProvider } from "@/providers/Auth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./styles.css";
import { Navbar } from "@/components/navbar/Navbar";
import { getMeUser } from "@/app/[locale]/(frontend)/actions/auth"; // We will fix this import path later if we move actions
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value || "light";

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const user = await getMeUser();

  return (
    <html lang={locale} className={themeCookie} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          value={{ light: "light", dark: "dark" }}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <AuthProvider initialUser={user}>
              <Navbar />
              <main className="pt-14">{children}</main>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
