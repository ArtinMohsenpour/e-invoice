"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginInput;
        formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const actionResult = await loginAction(formData);

    // If result is returned, it means there was an error
    // (Redirects throw errors that are caught by Next.js, so they don't return here)
    if (actionResult?.error) {
      setError(actionResult.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full  mx-auto">
        {/* Left Panel: Form */}
        <div className="flex w-full items-end flex-col justify-start px-4 py-12 sm:px-6 lg:pr-17.5 lg:pt-22 lg:flex-none lg:w-1/2">
          <div className="w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Login to your account
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Please enter your details.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <h3 className="font-semibold">Unable to sign in</h3>
                    <p className="mt-1 text-red-700 dark:text-red-400">
                      Please check your email and password and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Email address
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
                    placeholder="name@company.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={100}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                      }
                    }}
                    className={`block w-full rounded-md border ${
                      fieldErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-border focus:ring-brand"
                    } bg-input-bg px-3 py-2 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm sm:leading-6 transition-colors`}
                    placeholder="••••••••"
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.password}
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
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-brand hover:underline"
              >
                Sign up
              </Link>
            </p>
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

              <div className="mt-12 max-w-fit p-6 bg-background/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold ring-1 ring-brand/20">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Jan Schmidt</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CEO at TechBerlin GmbH
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  &quot;Finally an invoicing tool that actually understands
                  German tax laws. Setup took 2 minutes.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
