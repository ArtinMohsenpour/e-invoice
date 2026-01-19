import type React from "react";
import { AuthProvider } from "@/providers/Auth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./styles.css";
import { Navbar } from "@/components/navbar/Navbar";
import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { getMeUser } from "./actions/auth";

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const payload = await getPayload({ config });
  const headersList = await headers();
  const user = await getMeUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={user}>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
