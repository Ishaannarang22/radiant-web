"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Step = "input" | "scraping" | "confirm" | "generating" | "done"

interface BusinessData {
  name: string
  address: string
  city: string
  state: string
  phone: string
  rating: number
  reviewCount: number
  category: string
  industry: string
  hours: Array<{ day: string; open: string; close: string }>
  photos: Array<{ url: string; width: number; height: number }>
  reviews: Array<{ author: string; rating: number; text: string; date: string }>
  website?: string
  location: { lat: number; lng: number }
  existingContent?: {
    headlines: string[]
    descriptions: string[]
    services: string[]
    about: string
  }
}

interface ProgressEvent {
  stage: string
  message: string
  percent?: number
}

const scrapeStages = [
  { key: "searching", label: "Finding business on Google..." },
  { key: "scraping", label: "Scraping website content..." },
  { key: "analyzing", label: "Analyzing business data..." },
]

const generateStages = [
  { key: "building_prompt", label: "Preparing AI context..." },
  { key: "generating", label: "Building your website..." },
  { key: "parsing", label: "Assembling site files..." },
  { key: "saving", label: "Saving to database..." },
]

export function GenerationFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("input")
  const [businessName, setBusinessName] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [scrapeStageIdx, setScrapeStageIdx] = useState(0)
  const [genProgress, setGenProgress] = useState<ProgressEvent | null>(null)
  const [genPercent, setGenPercent] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const handleScrape = useCallback(async () => {
    if (!businessName.trim() || !location.trim()) return
    setError(null)
    setStep("scraping")
    setScrapeStageIdx(0)

    // Animate through scraping stages
    const timer1 = setTimeout(() => setScrapeStageIdx(1), 1500)
    const timer2 = setTimeout(() => setScrapeStageIdx(2), 3000)

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          location: location.trim(),
        }),
      })

      clearTimeout(timer1)
      clearTimeout(timer2)

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Scraping failed" }))
        throw new Error(data.error || `Scraping failed (${res.status})`)
      }

      const { data } = await res.json()
      setBusiness(data)
      setStep("confirm")
    } catch (err) {
      clearTimeout(timer1)
      clearTimeout(timer2)
      setError(err instanceof Error ? err.message : "Failed to find business")
      setStep("input")
    }
  }, [businessName, location])

  const handleGenerate = useCallback(async () => {
    if (!business) return
    setError(null)
    setStep("generating")
    setGenPercent(0)
    setGenProgress(null)

    try {
      // Step 1: Create a project
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          industry: business.industry,
        }),
      })

      if (!createRes.ok) {
        const d = await createRes.json().catch(() => ({ error: "Failed to create project" }))
        throw new Error(d.error || "Failed to create project")
      }

      const { projectId: pid } = await createRes.json()
      setProjectId(pid)

      // Step 2: Generate via SSE
      abortRef.current = new AbortController()
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ projectId: pid, businessProfile: business }),
        signal: abortRef.current.signal,
      })

      if (!genRes.ok) {
        const d = await genRes.json().catch(() => ({ error: "Generation failed" }))
        throw new Error(d.error || `Generation failed (${genRes.status})`)
      }

      // Read SSE stream
      const reader = genRes.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          let eventType = ""
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7)
            } else if (line.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(line.slice(6))
                if (eventType === "progress") {
                  setGenProgress(parsed)
                  setGenPercent(parsed.percent ?? genPercent)
                } else if (eventType === "complete") {
                  setStep("done")
                  // Redirect to preview
                  setTimeout(() => router.push(`/preview/${pid}`), 1200)
                } else if (eventType === "error") {
                  throw new Error(parsed.error || "Generation failed")
                }
              } catch (e) {
                if (e instanceof Error && e.message !== "Generation failed") {
                  // JSON parse error, ignore incomplete data
                }
              }
            }
          }
        }
      }

      // If no SSE events set step to done, handle non-streaming fallback
      if (step === "generating") {
        setStep("done")
        setTimeout(() => router.push(`/preview/${pid}`), 1200)
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Generation failed")
      setStep("confirm")
    }
  }, [business, router, step, genPercent])

  const handleBack = useCallback(() => {
    abortRef.current?.abort()
    setError(null)
    if (step === "confirm") {
      setStep("input")
      setBusiness(null)
    } else if (step === "generating") {
      setStep("confirm")
    }
  }, [step])

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Zap className="size-4 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Radiant</span>
          </Link>
          <StepIndicator current={step} />
        </div>
      </nav>

      {/* Content */}
      <div className="relative mx-auto max-w-2xl px-6 pt-32 pb-20">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-b from-amber-500/[0.06] via-orange-500/[0.03] to-transparent blur-3xl" />

        <div className="relative">
          {step === "input" && (
            <InputStep
              businessName={businessName}
              location={location}
              error={error}
              onBusinessNameChange={setBusinessName}
              onLocationChange={setLocation}
              onSubmit={handleScrape}
            />
          )}

          {step === "scraping" && <ScrapingStep stageIdx={scrapeStageIdx} />}

          {step === "confirm" && business && (
            <ConfirmStep
              business={business}
              error={error}
              onConfirm={handleGenerate}
              onBack={handleBack}
            />
          )}

          {step === "generating" && (
            <GeneratingStep progress={genProgress} percent={genPercent} />
          )}

          {step === "done" && (
            <DoneStep projectId={projectId} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step Indicator ───────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps: Array<{ key: Step | "done"; label: string }> = [
    { key: "input", label: "Search" },
    { key: "confirm", label: "Confirm" },
    { key: "generating", label: "Generate" },
    { key: "done", label: "Preview" },
  ]

  const stepOrder: Step[] = ["input", "scraping", "confirm", "generating", "done"]
  const currentIdx = stepOrder.indexOf(current)

  function getStepState(key: string) {
    const keyIdx =
      key === "input" || key === "scraping"
        ? 0
        : key === "confirm"
          ? 2
          : key === "generating"
            ? 3
            : 4
    if (currentIdx > keyIdx) return "done"
    if (
      (key === "input" && (current === "input" || current === "scraping")) ||
      (key === "confirm" && current === "confirm") ||
      (key === "generating" && current === "generating") ||
      (key === "done" && current === "done")
    )
      return "active"
    return "pending"
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      {steps.map((s, i) => {
        const state = getStepState(s.key)
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                state === "done"
                  ? "bg-amber-400 text-black"
                  : state === "active"
                    ? "bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/40"
                    : "bg-white/[0.06] text-white/30"
              }`}
            >
              {state === "done" ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                state === "active" ? "text-white" : state === "done" ? "text-white/60" : "text-white/30"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 ${state === "done" ? "bg-amber-400/40" : "bg-white/[0.08]"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1: Input ────────────────────────────────────────

function InputStep({
  businessName,
  location,
  error,
  onBusinessNameChange,
  onLocationChange,
  onSubmit,
}: {
  businessName: string
  location: string
  error: string | null
  onBusinessNameChange: (v: string) => void
  onLocationChange: (v: string) => void
  onSubmit: () => void
}) {
  const canSubmit = businessName.trim().length > 0 && location.trim().length > 0

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 ring-1 ring-amber-400/20">
          <Search className="size-6 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find your business
        </h1>
        <p className="mt-3 text-base text-white/40">
          Enter the business name and location. We&apos;ll find it on Google and pull in all the details.
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <div>
          <label htmlFor="business-name" className="mb-2 block text-sm font-medium text-white/60">
            Business Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <Input
              id="business-name"
              placeholder="e.g. Joe's Pizza"
              value={businessName}
              onChange={(e) => onBusinessNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
              className="h-12 border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium text-white/60">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <Input
              id="location"
              placeholder="e.g. New York, NY"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
              className="h-12 border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/20"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-400">
            <XCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="h-12 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-base font-semibold text-black hover:from-amber-300 hover:to-orange-400 disabled:opacity-40"
        >
          <Search className="size-4" />
          Find Business
        </Button>
      </div>
    </div>
  )
}

// ── Step 2: Scraping ─────────────────────────────────────

function ScrapingStep({ stageIdx }: { stageIdx: number }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 ring-1 ring-amber-400/20">
          <Globe className="size-6 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Searching...</h1>
        <p className="mt-3 text-base text-white/40">
          Finding your business and gathering information.
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-3">
        {scrapeStages.map((stage, i) => (
          <div
            key={stage.key}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-500 ${
              i < stageIdx
                ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                : i === stageIdx
                  ? "border-amber-400/20 bg-amber-400/[0.04]"
                  : "border-white/[0.06] bg-white/[0.01] opacity-40"
            }`}
          >
            {i < stageIdx ? (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            ) : i === stageIdx ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-amber-400" />
            ) : (
              <div className="size-5 shrink-0 rounded-full border border-white/[0.1]" />
            )}
            <span
              className={`text-sm font-medium ${
                i < stageIdx
                  ? "text-emerald-400/80"
                  : i === stageIdx
                    ? "text-white"
                    : "text-white/30"
              }`}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 3: Confirm Business ─────────────────────────────

function ConfirmStep({
  business,
  error,
  onConfirm,
  onBack,
}: {
  business: BusinessData
  error: string | null
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 ring-1 ring-emerald-400/20">
          <CheckCircle2 className="size-6 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">We found it!</h1>
        <p className="mt-3 text-base text-white/40">
          Is this the right business? Confirm to start generating your website.
        </p>
      </div>

      {/* Business card */}
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        {/* Photo */}
        {business.photos.length > 0 && (
          <div className="relative h-40 w-full overflow-hidden bg-white/[0.03]">
            <img
              src={business.photos[0].url}
              alt={business.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold">{business.name}</h2>
            <p className="mt-1 text-sm text-white/40">{business.category}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {business.rating > 0 && (
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="size-4 fill-amber-400" />
                <span className="font-medium">{business.rating}</span>
                <span className="text-white/30">({business.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-white/50">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-white/30" />
              <span>{business.address}, {business.city}, {business.state}</span>
            </div>
            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-white/30" />
                <span>{business.phone}</span>
              </div>
            )}
            {business.hours.length > 0 && (
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-white/30" />
                <span>{business.hours[0].day}: {business.hours[0].open} - {business.hours[0].close}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-md flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-400">
          <XCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mx-auto flex max-w-md gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          <ArrowLeft className="size-4" />
          Search Again
        </Button>
        <Button
          onClick={onConfirm}
          className="h-12 flex-[2] bg-gradient-to-r from-amber-400 to-orange-500 text-base font-semibold text-black hover:from-amber-300 hover:to-orange-400"
        >
          <Sparkles className="size-4" />
          Generate Website
        </Button>
      </div>
    </div>
  )
}

// ── Step 4: Generating ───────────────────────────────────

function GeneratingStep({
  progress,
  percent,
}: {
  progress: ProgressEvent | null
  percent: number
}) {
  // Simulate progress if no SSE events
  const [simPercent, setSimPercent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSimPercent((p) => {
        if (p >= 90) return p
        return p + Math.random() * 3
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const displayPercent = Math.round(percent > 0 ? percent : simPercent)
  const currentMessage = progress?.message || "Building your website..."

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 ring-1 ring-amber-400/20">
          <Sparkles className="size-6 text-amber-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Generating...</h1>
        <p className="mt-3 text-base text-white/40">
          Our AI is building a complete website. This usually takes about 30 seconds.
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">{currentMessage}</span>
            <span className="font-mono text-amber-400">{displayPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
        </div>

        {/* Generation stages */}
        <div className="space-y-2">
          {generateStages.map((stage, i) => {
            const stagePercents = [0, 20, 60, 85]
            const isComplete = displayPercent > (stagePercents[i + 1] ?? 100)
            const isActive =
              displayPercent >= stagePercents[i] && displayPercent <= (stagePercents[i + 1] ?? 100)

            return (
              <div
                key={stage.key}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-300 ${
                  isComplete
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                    : isActive
                      ? "border-amber-400/20 bg-amber-400/[0.03]"
                      : "border-white/[0.04] bg-transparent opacity-40"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-amber-400" />
                ) : (
                  <div className="size-4 shrink-0 rounded-full border border-white/[0.1]" />
                )}
                <span
                  className={`text-sm ${
                    isComplete
                      ? "text-emerald-400/70"
                      : isActive
                        ? "text-white"
                        : "text-white/30"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Step 5: Done ─────────────────────────────────────────

function DoneStep({ projectId }: { projectId: string | null }) {
  return (
    <div className="space-y-8 text-center">
      <div>
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 ring-1 ring-emerald-400/20">
          <CheckCircle2 className="size-6 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your website is ready!</h1>
        <p className="mt-3 text-base text-white/40">
          Redirecting you to the preview...
        </p>
      </div>

      <div className="flex justify-center">
        <Loader2 className="size-6 animate-spin text-amber-400" />
      </div>

      {projectId && (
        <Button
          asChild
          className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold hover:from-amber-300 hover:to-orange-400"
        >
          <Link href={`/preview/${projectId}`}>
            Go to Preview
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
