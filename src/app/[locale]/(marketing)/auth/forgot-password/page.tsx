"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { forgotPasswordAction } from "@/app/actions/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ForgotPasswordInput, string>>
  >({});

  const t = useTranslations("Auth.ForgotPassword");
  const tp = useTranslations("Auth.Placeholders");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const formattedErrors: Partial<
        Record<keyof ForgotPasswordInput, string>
      > = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ForgotPasswordInput;
        formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    const actionResult = await forgotPasswordAction(formData);

    if (actionResult?.error) {
      setError(
        typeof actionResult.error === "string"
          ? actionResult.error
          : "An error occurred. Please try again."
      );
    } else if (actionResult?.success) {
      setSuccess(actionResult.success);
      setEmail(""); // Clear the field on success
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full bg-background  pt-15">
      <div className="flex min-h-screen w-full mx-auto">
        {/* Left Panel: Form */}
        <div className="flex w-full items-end flex-col justify-start px-4 py-12 sm:px-6 lg:pr-28 lg:pt-20 lg:flex-none lg:w-1/2">
          <div className="w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToLogin")}
              </Link>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("description")}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <h3 className="font-semibold">{t("errorTitle")}</h3>
                    <p className="mt-1 text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-800 border border-green-100 dark:bg-green-900/10 dark:text-green-300 dark:border-green-900/30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-semibold">{t("successTitle")}</h3>
                    <p className="mt-1 text-green-700 dark:text-green-400">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleForgotPassword}
              className="space-y-6"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  {t("emailLabel")}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={100}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    className={`block w-full rounded-md border ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-border focus:ring-brand"
                    } bg-input-bg px-3 py-2 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm sm:leading-6 transition-colors`}
                    placeholder={tp("email")}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer justify-center rounded-md bg-brand px-3 py-2.5 text-sm font-semibold leading-6 text-brand-foreground shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t("submitButton")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel: Feature/Brand */}
        <div className="relative hidden w-0 flex-1 lg:block bg-surface">
          <div className="absolute inset-0 h-full w-full">
            {/* Abstract Decorative Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#0b1120_1px,transparent_1px)] dark:bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

            <div className="relative z-10 flex h-full flex-col justify-start lg:pt-22 px-16 text-foreground">
              <div className="mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  Enterprise-grade security
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Bank-level encryption and full ZUGFeRD compliance built right
                  into the platform.
                </p>
              </div>

              <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Automated Tax Compliance
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Multi-currency Support (EUR, USD, GBP)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Real-time Invoice Tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
