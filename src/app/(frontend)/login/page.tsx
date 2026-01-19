"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "../actions/auth";
import Link from "next/link";
import { useAuth } from "@/providers/Auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertCircle, TriangleAlert } from "lucide-react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.user) {
      setUser(state.user);
      router.refresh();
      router.push("/dashboard");
    }
  }, [state, setUser, router]);

  // Global error message (only if state.error is a string)
  const globalError = typeof state?.error === "string" ? state.error : null;

  // Type guard for field errors
  const fieldErrors = typeof state?.error === "object" ? state.error : null;

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border mt-12 border-border bg-card text-card-foreground shadow-sm p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground">Login</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <form action={action} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              defaultValue={state?.fields?.email}
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
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
              autoComplete="current-password"
              defaultValue={state?.fields?.password}
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
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:underline"
          >
            Forgot password?
          </Link>
          <div className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
