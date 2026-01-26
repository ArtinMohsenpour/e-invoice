'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been
          removed, renamed, or is temporarily unavailable.
        </p>
      </div>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Home className="mr-2 h-4 w-4" />
          Go back home
        </Link>
        <button
          onClick={() => router.back()}
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </button>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          If you believe this is a mistake, please{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}