import Link from "next/link";
import {
  Zap,
  Globe,
  Search,
  Sparkles,
  Smartphone,
  BarChart3,
  Palette,
  Clock,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "@/components/landing/hero-demo";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Enter a Business",
    desc: "Type any business name and location. We find it on Google and scrape their reviews, photos, hours, and existing website.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI Generates",
    desc: "Claude AI builds a complete, modern website using real business data — tailored to the industry with premium components.",
  },
  {
    num: "03",
    icon: Globe,
    title: "Go Live Instantly",
    desc: "Preview your site and deploy it to a custom subdomain with one click. Share it with customers immediately.",
  },
];

const industries = [
  { name: "Restaurants", emoji: "🍕", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/20" },
  { name: "Dental", emoji: "🦷", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/20" },
  { name: "Salons", emoji: "💇", color: "from-pink-500/20 to-purple-500/20", border: "border-pink-500/20" },
  { name: "Plumbers", emoji: "🔧", color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/20" },
  { name: "Law Firms", emoji: "⚖️", color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/20" },
  { name: "Auto Shops", emoji: "🚗", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
];

const features = [
  {
    icon: Smartphone,
    title: "Fully Responsive",
    desc: "Every generated site looks stunning on desktop, tablet, and mobile. No extra work needed.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Built on Next.js with optimized assets. Your site loads in milliseconds, not seconds.",
  },
  {
    icon: BarChart3,
    title: "SEO Optimized",
    desc: "Proper meta tags, semantic HTML, structured data — ready to rank on Google from day one.",
  },
  {
    icon: Palette,
    title: "Premium Design",
    desc: "Uses shadcn/ui, Aceternity, and Magic UI components for a look that rivals hand-crafted sites.",
  },
  {
    icon: Star,
    title: "Reviews Built In",
    desc: "Google reviews are automatically pulled in and beautifully displayed to build trust with visitors.",
  },
  {
    icon: Clock,
    title: "60-Second Delivery",
    desc: "From business name to live website in under a minute. Not weeks. Not days. Seconds.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try it out — generate and deploy one site.",
    features: ["1 generated site", "Custom subdomain", "Basic templates", "Community support"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For freelancers and small business owners.",
    features: [
      "10 generated sites",
      "Custom subdomains",
      "All industry templates",
      "Priority generation",
      "Edit & regenerate",
      "Email support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    desc: "For agencies managing multiple clients.",
    features: [
      "Unlimited sites",
      "Custom domains",
      "White-label option",
      "Bulk generation",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* ---- NAV ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Zap className="size-4 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Radiant</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-white/50 transition-colors hover:text-white">
              How It Works
            </a>
            <a href="#features" className="text-sm text-white/50 transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-sm text-white/50 transition-colors hover:text-white">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium hover:from-amber-300 hover:to-orange-400"
              asChild
            >
              <Link href="/generate">Try It Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-amber-500/[0.08] via-orange-500/[0.04] to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-40 left-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
            {/* Left: copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-4 py-1.5 text-xs font-medium text-amber-400">
                <Sparkles className="size-3.5" />
                AI-Powered Website Generation
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                A stunning website for any business in{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  60 seconds
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/50">
                Enter a business name and location. Our AI scrapes their online presence and generates a
                complete, modern, production-ready website — deployed instantly.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold hover:from-amber-300 hover:to-orange-400 h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/generate">
                    Try It Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/[0.1] bg-white/[0.03] text-white hover:bg-white/[0.06] h-12 px-8 text-base"
                  asChild
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>
              <p className="mt-5 text-sm text-white/30">No credit card required. Generate your first site free.</p>
            </div>

            {/* Right: demo */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-br from-amber-500/[0.06] to-transparent blur-2xl" />
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section id="how-it-works" className="relative border-t border-white/[0.06] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to a live website
            </h2>
            <p className="mt-4 text-lg text-white/40">
              No design skills. No coding. No content writing. Just enter a business name.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-colors hover:border-amber-400/20 hover:bg-amber-400/[0.02]"
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-mono text-sm text-amber-400/60">{step.num}</span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/60 group-hover:bg-amber-400/10 group-hover:text-amber-400 transition-colors">
                    <step.icon className="size-5" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-white/40">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- EXAMPLES ---- */}
      <section id="examples" className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Works for every industry
            </h2>
            <p className="mt-4 text-lg text-white/40">
              From restaurants to law firms — AI adapts the design, content, and features to match the business type.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border ${ind.border} bg-gradient-to-b ${ind.color} p-6 transition-transform hover:scale-105`}
              >
                <span className="text-3xl">{ind.emoji}</span>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  {ind.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { label: "Industries Supported", value: "20+" },
                { label: "Sites Generated", value: "1,000+" },
                { label: "Avg. Generation Time", value: "47s" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent sm:text-4xl">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section id="features" className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Not just fast — genuinely good
            </h2>
            <p className="mt-4 text-lg text-white/40">
              Generated sites rival hand-crafted ones. Here&apos;s what makes them stand out.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-white/[0.12]"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/50 group-hover:text-amber-400 transition-colors">
                  <feat.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{feat.title}</h3>
                <p className="mt-2 leading-relaxed text-white/40 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- PRICING ---- */}
      <section id="pricing" className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-white/40">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-amber-400/30 bg-gradient-to-b from-amber-400/[0.06] to-transparent"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/40">{plan.desc}</p>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="size-4 shrink-0 text-amber-400/70" />
                      <span className="text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold hover:from-amber-300 hover:to-orange-400"
                      : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                  }`}
                  size="lg"
                  asChild
                >
                  <Link href="/generate">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] via-orange-500/[0.04] to-transparent p-12 text-center md:p-20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to generate your first site?
              </h2>
              <p className="mt-4 text-lg text-white/40">
                It takes 60 seconds. No sign-up required.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold hover:from-amber-300 hover:to-orange-400 h-12 px-8 text-base"
                asChild
              >
                <Link href="/generate">
                  Generate a Website Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                  <Zap className="size-3.5 text-black" />
                </div>
                <span className="font-semibold tracking-tight">Radiant</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/30">
                AI-powered website generation for local businesses. Beautiful sites in seconds, not weeks.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#how-it-works" className="text-sm text-white/30 hover:text-white/60 transition-colors">How It Works</a></li>
                <li><a href="#features" className="text-sm text-white/30 hover:text-white/60 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-white/30 hover:text-white/60 transition-colors">Pricing</a></li>
                <li><a href="#examples" className="text-sm text-white/30 hover:text-white/60 transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/[0.06] pt-8 text-center text-sm text-white/20">
            &copy; {new Date().getFullYear()} Radiant Web. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
