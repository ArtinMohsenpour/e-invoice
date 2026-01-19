'use client'

import Link from 'next/link'
import { useActionState } from 'react'

// Dummy action
async function signupAction(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { error: 'This is a dummy signup. Functionality coming later.' }
}

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signupAction, null)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Card Container */}
        <div className="bg-card text-card-foreground border border-border shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to get started.
              </p>
            </div>

            {/* Form */}
            <form action={action} className="space-y-5">
              
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="firstName" 
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor="lastName" 
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-sm font-medium leading-none text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="text-sm font-medium leading-none text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label 
                  htmlFor="confirmPassword" 
                  className="text-sm font-medium leading-none text-foreground"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Error Message */}
              {state?.error && (
                <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive">
                  {state.error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <p className="mt-6 text-center text-xs text-muted-foreground px-8">
          By clicking continue, you agree to our <a href="#" className="underline underline-offset-4 hover:text-foreground">Terms of Service</a> and <a href="#" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
