"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { signupAction } from "@/app/actions/auth";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupInput, string>>
  >({});

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const result = signupSchema.safeParse({ email, password, companyName });

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof SignupInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof SignupInput;
        formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("companyName", companyName);

    const actionResult = await signupAction(formData);

    if (actionResult?.error) {
      setError(actionResult.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full mx-auto">
        {/* Left Panel: Form */}
        <div className="flex w-full items-end flex-col justify-start px-4 py-12 sm:px-6 lg:pr-17.5 lg:pt-22 lg:flex-none lg:w-1/2">
          <div className="w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start your 14-day free trial. No credit card required.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Unable to create account</h3>
                    <p className="mt-1 text-red-700 dark:text-red-400">
                      Please check your details and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Company or Legal Name
                </label>
                <div className="mt-2">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    maxLength={100}
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (fieldErrors.companyName) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          companyName: undefined,
                        }));
                      }
                    }}
                    className={`block w-full rounded-md border ${
                      fieldErrors.companyName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-border focus:ring-brand"
                    } bg-input-bg px-3 py-2 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm sm:leading-6 transition-colors`}
                    placeholder="Telekom GmbH"
                  />
                  {fieldErrors.companyName ? (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.companyName}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Freelancers should enter their full legal name.
                    </p>
                  )}
                </div>
              </div>

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
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
                    } bg-input-bg px-3 py-2 pr-10 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm sm:leading-6 transition-colors`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-border text-brand focus:ring-brand bg-input-bg"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-500 dark:text-gray-400"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-brand hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-brand hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-brand px-3 py-2.5 text-sm font-semibold leading-6 text-brand-foreground shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Already a member?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-brand hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel: Feature/Brand */}
        <div className="relative hidden w-0 flex-1 lg:block bg-surface">
          <div className="absolute inset-0 h-full w-full">
            {/* Abstract Decorative Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#0b1120_1px,transparent_1px)] dark:bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

            <div className="relative z-10 flex h-full flex-col justify-start lg:pt-22  px-16 text-foreground">
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