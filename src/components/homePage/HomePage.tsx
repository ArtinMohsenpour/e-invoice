"use client";

import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  FileCheck,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // In a real app, these would come from your localization files via useTranslations
  // For now, I'll hardcode english text or use simple placeholders if t() isn't set up for these specific keys yet.

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70"></div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Ready for E-Rechnung 2026 Mandate
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Effortless <span className="text-primary">E-Invoicing</span>{" "}
            Compliance for German Business
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Instantly convert your existing PDF invoices into compliant ZUGFeRD
            and XRechnung formats. Secure, fast, and ready for the 2026-2028 B2B
            mandate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              Start Converting Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              How it works
            </Link>
          </div>

          <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
            {/* Abstract representation of the UI */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="p-4 rounded-lg bg-background border border-border shadow-sm flex items-center gap-3">
                  <FileUp className="text-red-500" />
                  <div>
                    <p className="text-sm font-medium">invoice_2024_001.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Traditional PDF
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />
                </div>
                <div className="p-4 rounded-lg bg-background border border-green-500/30 shadow-sm flex items-center gap-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-500/5"></div>
                  <FileCheck className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium">
                      invoice_2024_001_zugferd.xml
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ZUGFeRD 2.2 Compliant
                    </p>
                  </div>
                  <CheckCircle2 className="ml-auto text-green-600 w-5 h-5" />
                </div>
              </div>
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-lg">Analysis Complete</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Syntax
                    Validation Passed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> EN 16931
                    Compliance Verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Tax
                    Calculation Correct
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPLIANCE INFO */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Now? The German B2B Mandate
            </h2>
            <p className="text-muted-foreground">
              Germany is mandating E-Invoicing for all B2B transactions. Prepare
              your business for the transition timeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black">1</span>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jan 1, 2025</h3>
              <p className="text-sm font-medium text-primary mb-4">
                Receiver Readiness
              </p>
              <p className="text-muted-foreground text-sm">
                All German businesses must be able to <strong>receive</strong>{" "}
                and archive e-invoices. We provide the viewer and storage you
                need.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black">2</span>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jan 1, 2027</h3>
              <p className="text-sm font-medium text-primary mb-4">
                Large Cap Mandate
              </p>
              <p className="text-muted-foreground text-sm">
                Companies with turnover &gt; €800k must <strong>issue</strong>{" "}
                e-invoices for B2B transactions. Automation becomes critical.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black">3</span>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jan 1, 2028</h3>
              <p className="text-sm font-medium text-primary mb-4">
                Full Compliance
              </p>
              <p className="text-muted-foreground text-sm">
                Strict obligation for <strong>all</strong> remaining small
                businesses to issue e-invoices. No more paper or simple PDFs
                allowed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Powerful Conversion Engine <br />
                <span className="text-primary">Without the Complexity</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform abstracts away the complex XML structures of
                ZUGFeRD and XRechnung. You focus on your business, we handle the
                syntax.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Hybrid PDF Generation
                    </h3>
                    <p className="text-muted-foreground">
                      Creates PDF/A-3 files with embedded XML data (ZUGFeRD),
                      readable by both humans and machines.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure & Private</h3>
                    <p className="text-muted-foreground">
                      End-to-end encryption. Your financial data is processed
                      securely and never shared with third parties.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Bulk Processing</h3>
                    <p className="text-muted-foreground">
                      Upload hundreds of invoices at once. Our API and batch
                      tools handle high-volume demands efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-primary to-purple-600 opacity-20 blur-2xl rounded-[3rem]"></div>
              <div className="relative rounded-2xl bg-card border border-border shadow-2xl p-8">
                <h4 className="font-semibold mb-6 border-b border-border pb-4">
                  Conversion Preview
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="font-mono text-sm text-muted-foreground">
                      Standard
                    </span>
                    <span className="font-bold text-sm">EN 16931</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="font-mono text-sm text-muted-foreground">
                      Profile
                    </span>
                    <span className="font-bold text-sm">EXTENDED</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="font-mono text-sm text-muted-foreground">
                      Validation
                    </span>
                    <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-950 text-zinc-50 font-mono text-xs overflow-x-auto">
                    <pre>{`<rsm:CrossIndustryInvoice>
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  ...
</rsm:CrossIndustryInvoice>`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIALS / TRUST */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by German Businesses
            </h2>
            <p className="text-muted-foreground">
              Join hundreds of companies preparing for the digital future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background p-8 rounded-xl border border-border/50 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <p className="text-muted-foreground grow italic mb-6">
                  {`"${
                    i === 1
                      ? "The easiest way to generate ZUGFeRD invoices. It literally saved us weeks of development time."
                      : i === 2
                        ? "We were worried about the 2025 regulations, but this tool made compliance instant and painless."
                        : "The API integration is flawless. We connected it to our ERP system in under two hours."
                  }"`}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                    {i === 1 ? "JS" : i === 2 ? "MK" : "AL"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {i === 1
                        ? "Jürgen Schmidt"
                        : i === 2
                          ? "Maria Koch"
                          : "Andreas Lang"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1
                        ? "CTO, TechGmbH"
                        : i === 2
                          ? "Finance Lead, BerlinSoft"
                          : "Developer, AutoSys"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Switch to E-Invoicing?
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Get ahead of the mandate. Start creating compliant invoices today
            with our easy-to-use platform. No credit card required for trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 rounded-full bg-background text-foreground font-bold hover:bg-zinc-100 transition-colors shadow-xl"
            >
              Get Started for Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Contact Sales
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-70">
            Compliant with EN 16931 • ZUGFeRD 2.2 • XRechnung 3.0
          </p>
        </div>
      </section>
    </div>
  );
}
