"use client";

import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../../actions/auth";
import Link from "next/link";
import { useAuth } from "@/providers/Auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertCircle, TriangleAlert, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const { setUser } = useAuth();
  const router = useRouter();
  const t = useTranslations('Auth');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (state?.success && state.user) {
      setIsRedirecting(true);
      setUser(state.user);
      router.refresh();
      router.push("/dashboard");
    }
  }, [state, setUser, router]);

  // Global error message (only if state.error is a string)
  const globalError = typeof state?.error === "string" ? state.error : null;

  // Type guard for field errors
  const fieldErrors = typeof state?.error === "object" ? state.error : null;

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight">
              {t('loginSuccess')}
            </h3>
            <p className="text-muted-foreground">
              {t('redirecting')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground">{t('loginTitle')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('loginSubtitle')}
          </p>
        </div>
        <form action={action} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {t('emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              defaultValue={state?.fields?.email as string}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                fieldErrors?.email &&
                  "border-destructive focus:ring-destructive",
              )}
            />
            {fieldErrors?.email && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs font-medium">{fieldErrors.email[0]}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
              autoComplete="current-password"
              defaultValue={state?.fields?.password as string}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                fieldErrors?.password &&
                  "border-destructive focus:ring-destructive",
              )}
            />
            {fieldErrors?.password && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs font-medium">{fieldErrors.password[0]}</p>
              </div>
            )}
          </div>

          {globalError && (
            <div
              className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive"
              role="alert"
              aria-live="polite"
            >
              <TriangleAlert className="h-4 w-4" />
              <p>{globalError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 w-full mt-4 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? t('submitLoginPending') : t('submitLogin')}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:underline"
          >
            {t('forgotPassword')}
          </Link>
          <div className="text-muted-foreground">
            {t('noAccount')}{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              {t('submitSignup')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}