"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full  mx-auto">
        {/* Left Panel: Form */}
        <div className="flex w-full items-end flex-col justify-start px-4 py-12 sm:px-6 lg:pr-17.5 lg:pt-22 lg:flex-none lg:w-1/2">
          <div className="w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Please enter your details.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-error/20">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-error"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-error">
                      There was an error
                    </h3>
                    <div className="mt-2 text-sm text-error/90">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-border bg-input-bg px-3 py-2 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent sm:text-sm sm:leading-6 transition-colors"
                    placeholder="name@company.com"
                  />
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-border bg-input-bg px-3 py-2 text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent sm:text-sm sm:leading-6 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
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

            <div className="relative z-10 flex h-full flex-col justify-center px-16 text-foreground">
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

              <div className="mt-12 p-6 bg-background/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
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
