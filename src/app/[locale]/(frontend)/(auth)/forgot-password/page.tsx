"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "../../actions/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, null);
  const t = useTranslations('Auth');

  // Global error message
  const globalError = typeof (state as any)?.error === "string" ? (state as any).error : null;

  // Type guard for field errors
  const fieldErrors = typeof (state as any)?.error === "object" ? (state as any).error : null;

  if ((state as any)?.success) {
    return (
      <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{t('verificationSent')}</h3>
          <p className="text-muted-foreground mb-6">
            {t('checkEmail')}
          </p>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground">{t('forgotPasswordTitle')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('forgotPasswordSubtitle')}
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
              defaultValue={(state as any)?.fields?.email as string}
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
            {isPending ? t('submitForgotPasswordPending') : t('submitForgotPassword')}
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