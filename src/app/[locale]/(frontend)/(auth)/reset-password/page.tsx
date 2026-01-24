"use client";

import { useActionState, useEffect, Suspense } from "react";
import { resetPasswordAction } from "../../actions/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, TriangleAlert, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/Auth";
import type { User } from "@/payload-types";

function ResetPasswordForm() {
  const [state, action, isPending] = useActionState(resetPasswordAction, null);
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    if (!token) {
        // Redirect to login if no token is present
        router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (state?.success && state.user) {
        setUser(state.user as unknown as User);
        router.refresh();
    }
  }, [state, setUser, router]);

  if (!token) {
      return null; 
  }

  if (state?.success) {
    return (
      <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{t('passwordResetSuccess')}</h3>
          <p className="text-muted-foreground mb-6">
             {t('loginSuccess')}
          </p>
          <Link
            href="/dashboard" // We logged them in automatically
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {t('goToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  // Global error message
  const globalError = typeof state?.error === "string" ? state.error : null;

  // Type guard for field errors
  const fieldErrors = typeof state?.error === "object" ? state.error : null;

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground">{t('resetPasswordTitle')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('resetPasswordSubtitle')}
          </p>
        </div>
        <form action={action} className="space-y-4" noValidate>
          <input type="hidden" name="token" value={token} />
          
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
              autoComplete="new-password"
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

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              {t('confirmPasswordLabel')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="********"
              required
              autoComplete="new-password"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                fieldErrors?.confirmPassword &&
                  "border-destructive focus:ring-destructive",
              )}
            />
             {fieldErrors?.confirmPassword && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs font-medium">{fieldErrors.confirmPassword[0]}</p>
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
            {isPending ? t('submitResetPasswordPending') : t('submitResetPassword')}
          </button>
        </form>
         <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
             <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}