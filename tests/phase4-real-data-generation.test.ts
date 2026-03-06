import { describe, it, expect, vi, beforeAll } from "vitest"
import type { BusinessProfile } from "@radiant/scraper"
import { mapCategoryToIndustry } from "../packages/scraper/industry-mapper"

// ── Set env vars before anything imports ────────────────────────
vi.hoisted(() => {
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || "https://test.supabase.co"
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "test-anon-key"
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test-service-key"
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "test-anthropic-key"
})

// ── Mock DB layer ───────────────────────────────────────────────
vi.mock("../packages/db/queries", () => ({
  updateProject: vi.fn().mockResolvedValue({ id: "proj-test", status: "generating" }),
  upsertProjectFiles: vi.fn().mockResolvedValue([]),
  logGeneration: vi.fn().mockResolvedValue({ id: "gen-test" }),
  createProject: vi.fn(),
  getProject: vi.fn(),
  getProjectsByUser: vi.fn(),
  getProjectFiles: vi.fn(),
  upsertBusiness: vi.fn(),
  getBusinessByPlaceId: vi.fn(),
  getGenerationsByProject: vi.fn(),
  searchComponents: vi.fn().mockResolvedValue([]),
  searchTemplates: vi.fn().mockResolvedValue([]),
  searchPatterns: vi.fn().mockResolvedValue([]),
}))

// ── Mock embeddings layer (return empty — prompt builder handles gracefully) ──
vi.mock("../apps/web/lib/embeddings", () => ({
  retrieveComponents: vi.fn().mockResolvedValue([]),
  retrieveTemplates: vi.fn().mockResolvedValue([]),
  retrievePatterns: vi.fn().mockResolvedValue([]),
  generateEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0)),
}))

// ── Import real modules (prompt builder, parser) ────────────────
import { buildGenerationPrompt } from "../apps/web/lib/prompt-builder"
import { parseAndValidate, parseFiles } from "../apps/web/lib/parser"
import { getBaseSystemPrompt } from "../apps/web/prompts/system"
import { getIndustryPrompt } from "../apps/web/prompts/industries"

// ── 5 business profiles from Phase 3 fixtures ───────────────────

function parseAddress(address: string): { city: string; state: string } {
  const parts = address.split(",").map((p) => p.trim())
  if (parts.length >= 3) {
    const city = parts[parts.length - 3] ?? ""
    const stateZip = parts[parts.length - 2] ?? ""
    const state = stateZip.replace(/\d{5}(-\d{4})?/, "").trim()
    return { city, state }
  }
  if (parts.length === 2) {
    return { city: parts[0], state: parts[1].replace(/\d{5}(-\d{4})?/, "").trim() }
  }
  return { city: "", state: "" }
}

function parseHours(weekdayText?: string[]): { day: string; open: string; close: string }[] {
  if (!weekdayText || weekdayText.length === 0) return []
  return weekdayText.map((entry) => {
    const colonIdx = entry.indexOf(":")
    if (colonIdx === -1) return { day: entry.trim(), open: "", close: "" }
    const day = entry.substring(0, colonIdx).trim()
    const timeRange = entry.substring(colonIdx + 1).trim()
    if (/closed/i.test(timeRange)) return { day, open: "Closed", close: "Closed" }
    const timeParts = timeRange.split(/\s*[–—-]\s*/)
    return { day, open: timeParts[0]?.trim() ?? "", close: timeParts[1]?.trim() ?? "" }
  })
}

const PROFILES: Record<string, BusinessProfile> = {
  restaurant: {
    name: "Joe's Pizza",
    address: "7 Carmine St, New York, NY 10014, USA",
    city: "New York",
    state: "NY",
    phone: "(212) 366-1182",
    website: "http://www.joespizzanyc.com",
    rating: 4.5,
    reviewCount: 8234,
    category: "pizza_restaurant",
    industry: "restaurant",
    hours: parseHours([
      "Monday: 10:00 AM – 4:00 AM",
      "Tuesday: 10:00 AM – 4:00 AM",
      "Wednesday: 10:00 AM – 4:00 AM",
      "Thursday: 10:00 AM – 4:00 AM",
      "Friday: 10:00 AM – 5:00 AM",
      "Saturday: 10:00 AM – 5:00 AM",
      "Sunday: 10:00 AM – 4:00 AM",
    ]),
    photos: [
      { url: "https://maps.googleapis.com/photo1", width: 800, height: 600 },
      { url: "https://maps.googleapis.com/photo2", width: 800, height: 600 },
    ],
    reviews: [
      { author: "John D.", rating: 5, text: "Best pizza in NYC! The classic slice is legendary.", date: "2 months ago" },
      { author: "Sarah M.", rating: 4, text: "Great pizza, worth the wait. Cash only!", date: "1 month ago" },
      { author: "Mike T.", rating: 5, text: "Authentic New York pizza. A must-visit.", date: "3 weeks ago" },
    ],
    location: { lat: 40.730661, lng: -74.002133 },
  },
  dental: {
    name: "Aspen Dental",
    address: "3259 N Halsted St, Chicago, IL 60657, USA",
    city: "Chicago",
    state: "IL",
    phone: "(773) 935-6400",
    website: "https://www.aspendental.com",
    rating: 4.1,
    reviewCount: 312,
    category: "dentist",
    industry: "dental",
    hours: parseHours([
      "Monday: 7:30 AM – 5:30 PM",
      "Tuesday: 7:30 AM – 5:30 PM",
      "Wednesday: 7:30 AM – 5:30 PM",
      "Thursday: 7:30 AM – 5:30 PM",
      "Friday: 7:30 AM – 1:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ]),
    photos: [{ url: "https://maps.googleapis.com/photo3", width: 800, height: 600 }],
    reviews: [
      { author: "Lisa P.", rating: 5, text: "Dr. Smith was wonderful. Very gentle and explained everything.", date: "1 month ago" },
      { author: "Tom R.", rating: 3, text: "Long wait time but good results. Staff is friendly.", date: "2 weeks ago" },
    ],
    location: { lat: 41.939743, lng: -87.649168 },
  },
  salon: {
    name: "Supercuts",
    address: "6333 W 3rd St, Los Angeles, CA 90036, USA",
    city: "Los Angeles",
    state: "CA",
    phone: "(323) 937-5900",
    website: "https://www.supercuts.com",
    rating: 3.8,
    reviewCount: 156,
    category: "hair_salon",
    industry: "salon",
    hours: parseHours([
      "Monday: 9:00 AM – 8:00 PM",
      "Tuesday: 9:00 AM – 8:00 PM",
      "Wednesday: 9:00 AM – 8:00 PM",
      "Thursday: 9:00 AM – 8:00 PM",
      "Friday: 9:00 AM – 8:00 PM",
      "Saturday: 9:00 AM – 6:00 PM",
      "Sunday: 10:00 AM – 5:00 PM",
    ]),
    photos: [
      { url: "https://maps.googleapis.com/photo4", width: 800, height: 600 },
      { url: "https://maps.googleapis.com/photo5", width: 800, height: 600 },
      { url: "https://maps.googleapis.com/photo6", width: 800, height: 600 },
    ],
    reviews: [
      { author: "Kim L.", rating: 4, text: "Quick and affordable. Good for basic haircuts.", date: "3 months ago" },
    ],
    location: { lat: 34.069720, lng: -118.362175 },
  },
  plumber: {
    name: "Roto-Rooter Plumbing & Water Cleanup",
    address: "5555 W Loop S, Houston, TX 77081, USA",
    city: "Houston",
    state: "TX",
    phone: "(713) 660-8022",
    website: "https://www.rotorooter.com",
    rating: 4.3,
    reviewCount: 548,
    category: "plumber",
    industry: "plumber",
    hours: parseHours([
      "Monday: Open 24 hours",
      "Tuesday: Open 24 hours",
      "Wednesday: Open 24 hours",
      "Thursday: Open 24 hours",
      "Friday: Open 24 hours",
      "Saturday: Open 24 hours",
      "Sunday: Open 24 hours",
    ]),
    photos: [],
    reviews: [
      { author: "Bob J.", rating: 5, text: "Came out within 2 hours on a Sunday. Fixed the problem quickly.", date: "1 week ago" },
      { author: "Amy S.", rating: 4, text: "Professional service. A bit pricey but they know what they're doing.", date: "2 months ago" },
    ],
    location: { lat: 29.737547, lng: -95.469901 },
  },
  lawyer: {
    name: "Morgan & Morgan",
    address: "20 N Orange Ave Suite 1600, Orlando, FL 32801, USA",
    city: "Orlando",
    state: "FL",
    phone: "(407) 420-1414",
    website: "https://www.forthepeople.com",
    rating: 4.4,
    reviewCount: 1023,
    category: "lawyer",
    industry: "lawyer",
    hours: parseHours([
      "Monday: 8:00 AM – 6:00 PM",
      "Tuesday: 8:00 AM – 6:00 PM",
      "Wednesday: 8:00 AM – 6:00 PM",
      "Thursday: 8:00 AM – 6:00 PM",
      "Friday: 8:00 AM – 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ]),
    photos: [{ url: "https://maps.googleapis.com/photo7", width: 800, height: 600 }],
    reviews: [
      { author: "David K.", rating: 5, text: "They fought for me and got a great settlement. Highly recommend.", date: "3 months ago" },
      { author: "Maria G.", rating: 5, text: "Very professional team. Kept me updated throughout the process.", date: "1 month ago" },
      { author: "Chris W.", rating: 4, text: "Good experience overall. Communication could be a bit better.", date: "2 weeks ago" },
    ],
    location: { lat: 28.541820, lng: -81.378992 },
  },
}

// ── Realistic mock Claude responses per industry ────────────────
// These simulate what Claude would actually generate for each business type.
// Each response must pass the real parser and validator.

function buildMockResponse(profile: BusinessProfile): string {
  const { name, phone, address, city, state, industry } = profile
  const hoursRows = profile.hours
    .map((h) => `                <tr><td className="pr-4 font-medium">${h.day}</td><td>${h.open === "Closed" ? "Closed" : `${h.open} - ${h.close}`}</td></tr>`)
    .join("\n")

  const reviewsJsx = profile.reviews
    .map(
      (r) => `          <div key="${r.author}" className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: ${r.rating} }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
              ))}
            </div>
            <p className="text-gray-600 mb-3">&quot;${r.text}&quot;</p>
            <p className="text-sm font-semibold text-gray-900">{/* author */}${r.author}</p>
          </div>`
    )
    .join("\n")

  const photosJsx = profile.photos.length > 0
    ? profile.photos
        .map(
          (p, i) => `        <div key={${i}} className="relative aspect-video overflow-hidden rounded-lg">
          <Image src="${p.url}" alt="${name}" fill className="object-cover" unoptimized />
        </div>`
        )
        .join("\n")
    : ""

  const gallerySection = photosJsx
    ? `
--- FILE: components/Gallery.tsx ---
import Image from "next/image"

export default function Gallery() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${photosJsx}
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`
    : ""

  // Industry-specific hero taglines
  const taglines: Record<string, string> = {
    restaurant: `The Best Pizza in ${city}`,
    dental: `Your Trusted ${city} Dental Care`,
    salon: `Premier Hair Salon in ${city}`,
    plumber: `${city}'s Most Trusted Plumbing Service`,
    lawyer: `Fighting for Justice in ${city}`,
  }
  const tagline = taglines[industry] ?? `Welcome to ${name}`

  // Industry-specific sections
  const industrySection = getIndustrySectionFile(profile)

  return `--- FILE: app/layout.tsx ---
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "${name} | ${city}, ${state}",
  description: "${name} located at ${address}. Call us at ${phone}. Rated ${profile.rating}/5 stars.",
  openGraph: {
    title: "${name}",
    description: "${name} in ${city}, ${state}. ${profile.reviewCount} reviews, ${profile.rating} stars.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable + " " + playfair.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
--- END FILE ---
--- FILE: app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;
--- END FILE ---
--- FILE: app/page.tsx ---
import Hero from "@/components/Hero"
import Reviews from "@/components/Reviews"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
${photosJsx ? 'import Gallery from "@/components/Gallery"' : ""}
${industrySection.importLine}

export default function Home() {
  return (
    <main>
      <Hero />
      ${industrySection.usageLine}
      <Reviews />
      ${photosJsx ? "<Gallery />" : ""}
      <Contact />
      <Footer />
    </main>
  )
}
--- END FILE ---
--- FILE: components/Hero.tsx ---
"use client"

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair">
          ${tagline}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          ${name} has been proudly serving ${city} with ${profile.reviewCount.toLocaleString()} happy customers and a ${profile.rating}-star rating.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:${phone.replace(/[^+\d]/g, "")}" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            Call ${phone}
          </a>
          <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
            Get Directions
          </a>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---
--- FILE: components/Reviews.tsx ---
export default function Reviews() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">${profile.rating} stars from ${profile.reviewCount.toLocaleString()} reviews</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
${reviewsJsx}
        </div>
      </div>
    </section>
  )
}
--- END FILE ---
--- FILE: components/Contact.tsx ---
export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-start gap-3">
                <span className="font-medium">Address:</span> ${address}
              </p>
              <p className="flex items-start gap-3">
                <span className="font-medium">Phone:</span>{" "}
                <a href="tel:${phone.replace(/[^+\d]/g, "")}" className="text-primary hover:underline">${phone}</a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Hours</h3>
            <table className="text-gray-600">
              <tbody>
${hoursRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---
--- FILE: components/Footer.tsx ---
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">${name}</h3>
            <p>${address}</p>
            <p className="mt-2">
              <a href="tel:${phone.replace(/[^+\d]/g, "")}" className="hover:text-white transition-colors">${phone}</a>
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hours</h3>
            <div className="space-y-1 text-sm">
              ${profile.hours.slice(0, 3).map((h) => `<p>${h.day}: ${h.open === "Closed" ? "Closed" : h.open + " - " + h.close}</p>`).join("\n              ")}
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Connect</h3>
            <p>Rated ${profile.rating}/5 from ${profile.reviewCount.toLocaleString()} reviews</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ${name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
--- END FILE ---
--- FILE: tailwind.config.ts ---
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          50: "#eff6ff",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
}

export default config
--- END FILE ---
${gallerySection}
${industrySection.fileBlock}`
}

function getIndustrySectionFile(profile: BusinessProfile): {
  importLine: string
  usageLine: string
  fileBlock: string
} {
  switch (profile.industry) {
    case "restaurant":
      return {
        importLine: 'import Menu from "@/components/Menu"',
        usageLine: "<Menu />",
        fileBlock: `--- FILE: components/Menu.tsx ---
export default function Menu() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Classic Cheese Slice</h3>
            <p className="text-gray-600">Our legendary New York-style cheese slice made fresh daily</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Pepperoni Pizza</h3>
            <p className="text-gray-600">Topped with premium pepperoni and our signature sauce</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Fresh Salads</h3>
            <p className="text-gray-600">Garden fresh salads to complement your meal</p>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`,
      }
    case "dental":
      return {
        importLine: 'import Services from "@/components/Services"',
        usageLine: "<Services />",
        fileBlock: `--- FILE: components/Services.tsx ---
export default function Services() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">General Dentistry</h3>
            <p className="text-gray-600">Cleanings, exams, fillings, and preventive care for the whole family</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Cosmetic Dentistry</h3>
            <p className="text-gray-600">Teeth whitening, veneers, and smile makeovers to boost your confidence</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Emergency Care</h3>
            <p className="text-gray-600">Same-day appointments for dental emergencies when you need us most</p>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`,
      }
    case "salon":
      return {
        importLine: 'import Services from "@/components/Services"',
        usageLine: "<Services />",
        fileBlock: `--- FILE: components/Services.tsx ---
export default function Services() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Haircuts</h3>
            <p className="text-gray-600">Expert cuts for men, women, and children in the latest styles</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Color Services</h3>
            <p className="text-gray-600">Full color, highlights, balayage, and color correction</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Styling</h3>
            <p className="text-gray-600">Blowouts, updos, and special occasion styling</p>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`,
      }
    case "plumber":
      return {
        importLine: 'import Services from "@/components/Services"',
        usageLine: "<Services />",
        fileBlock: `--- FILE: components/Services.tsx ---
export default function Services() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Drain Cleaning</h3>
            <p className="text-gray-600">Professional drain cleaning and unclogging for residential and commercial properties</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Water Heater Repair</h3>
            <p className="text-gray-600">Installation, repair, and maintenance of all water heater brands</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Emergency Plumbing</h3>
            <p className="text-gray-600">24/7 emergency service because plumbing problems never wait</p>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`,
      }
    case "lawyer":
      return {
        importLine: 'import PracticeAreas from "@/components/PracticeAreas"',
        usageLine: "<PracticeAreas />",
        fileBlock: `--- FILE: components/PracticeAreas.tsx ---
export default function PracticeAreas() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Personal Injury</h3>
            <p className="text-gray-600">Aggressive representation for accident victims to get the compensation they deserve</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Workers Compensation</h3>
            <p className="text-gray-600">Helping injured workers navigate the claims process and secure benefits</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Class Action</h3>
            <p className="text-gray-600">Standing up for groups of people harmed by corporate negligence</p>
          </div>
        </div>
      </div>
    </section>
  )
}
--- END FILE ---`,
      }
    default:
      return { importLine: "", usageLine: "", fileBlock: "" }
  }
}

// ── Tests ───────────────────────────────────────────────────────

describe("Phase 4.9: Test generation with real data", () => {
  // ── 1. Prompt building with real business data ──────────────
  describe("Prompt building with real business data", () => {
    for (const [industry, profile] of Object.entries(PROFILES)) {
      describe(`${industry}: ${profile.name}`, () => {
        let prompt: { system: string; user: string }

        beforeAll(async () => {
          prompt = await buildGenerationPrompt(profile)
        })

        it("produces a system prompt with base rules", () => {
          expect(prompt.system).toContain("OUTPUT FORMAT")
          expect(prompt.system).toContain("--- FILE:")
          expect(prompt.system).toContain("REQUIRED FILES")
          expect(prompt.system).toContain("CODE RULES")
        })

        it("includes the correct industry fragment", () => {
          const industryPrompt = getIndustryPrompt(industry)
          // The system prompt should contain the industry-specific fragment
          expect(prompt.system).toContain(industryPrompt.substring(0, 100))
        })

        it("produces a user prompt with business JSON data", () => {
          expect(prompt.user).toContain(profile.name)
          expect(prompt.user).toContain(profile.city)
          expect(prompt.user).toContain(profile.state)
          expect(prompt.user).toContain(profile.phone)
          expect(prompt.user).toContain(String(profile.rating))
        })

        it("includes reviews in user prompt", () => {
          if (profile.reviews.length > 0) {
            expect(prompt.user).toContain(profile.reviews[0].author)
            expect(prompt.user).toContain(profile.reviews[0].text)
          }
        })

        it("includes hours in user prompt", () => {
          if (profile.hours.length > 0) {
            expect(prompt.user).toContain(profile.hours[0].day)
          }
        })

        it("system prompt stays within budget", () => {
          // Default budget is 300K chars (~75K tokens)
          expect(prompt.system.length).toBeLessThan(300_000)
        })
      })
    }
  })

  // ── 2. Parse and validate realistic generated responses ─────
  describe("Parse and validate generated website code", () => {
    for (const [industry, profile] of Object.entries(PROFILES)) {
      describe(`${industry}: ${profile.name}`, () => {
        let mockResponse: string
        let parseResult: ReturnType<typeof parseAndValidate>

        beforeAll(() => {
          mockResponse = buildMockResponse(profile)
          parseResult = parseAndValidate(mockResponse)
        })

        it("parses successfully into multiple files", () => {
          expect(parseResult.files.length).toBeGreaterThanOrEqual(7)
        })

        it("includes required files (layout.tsx and page.tsx)", () => {
          const paths = parseResult.files.map((f) => f.path)
          expect(paths).toContain("app/layout.tsx")
          expect(paths).toContain("app/page.tsx")
        })

        it("includes Hero and Footer components", () => {
          const paths = parseResult.files.map((f) => f.path)
          expect(paths).toContain("components/Hero.tsx")
          expect(paths).toContain("components/Footer.tsx")
        })

        it("includes tailwind.config.ts", () => {
          const paths = parseResult.files.map((f) => f.path)
          expect(paths).toContain("tailwind.config.ts")
        })

        it("passes validation with no errors or only minor warnings", () => {
          // Allow minor placeholder warnings (e.g., star generation logic)
          // but no missing files or syntax errors
          const criticalErrors = parseResult.errors.filter(
            (e) => e.type === "missing_file" || e.type === "syntax_error"
          )
          expect(criticalErrors).toEqual([])
        })

        it("uses the real business name (no placeholder)", () => {
          const layoutFile = parseResult.files.find((f) => f.path === "app/layout.tsx")
          expect(layoutFile?.content).toContain(profile.name)
        })

        it("uses the real phone number", () => {
          const heroFile = parseResult.files.find((f) => f.path === "components/Hero.tsx")
          expect(heroFile?.content).toContain(profile.phone)
        })

        it("uses the real address", () => {
          const contactFile = parseResult.files.find((f) => f.path === "components/Contact.tsx")
          expect(contactFile?.content).toContain(profile.address)
        })

        it("uses real review content", () => {
          const reviewsFile = parseResult.files.find((f) => f.path === "components/Reviews.tsx")
          if (profile.reviews.length > 0) {
            expect(reviewsFile?.content).toContain(profile.reviews[0].text)
          }
        })

        it("uses real hours data", () => {
          const contactFile = parseResult.files.find((f) => f.path === "components/Contact.tsx")
          if (profile.hours.length > 0) {
            expect(contactFile?.content).toContain(profile.hours[0].day)
          }
        })

        it("all .tsx files have exports", () => {
          const tsxFiles = parseResult.files.filter(
            (f) => f.path.endsWith(".tsx") && !f.path.includes("tailwind.config")
          )
          for (const file of tsxFiles) {
            expect(file.content).toMatch(/\bexport\b/)
          }
        })

        it("components use responsive Tailwind classes", () => {
          const heroFile = parseResult.files.find((f) => f.path === "components/Hero.tsx")
          // Check for responsive prefixes (md:, lg:, sm:)
          expect(heroFile?.content).toMatch(/\b(sm|md|lg):/m)
        })

        it("uses semantic HTML elements", () => {
          const heroFile = parseResult.files.find((f) => f.path === "components/Hero.tsx")
          expect(heroFile?.content).toContain("<section")
          const footerFile = parseResult.files.find((f) => f.path === "components/Footer.tsx")
          expect(footerFile?.content).toContain("<footer")
        })

        it("has clickable phone link (tel:)", () => {
          const allContent = parseResult.files.map((f) => f.content).join("\n")
          expect(allContent).toContain("tel:")
        })

        it("layout has metadata with business name", () => {
          const layout = parseResult.files.find((f) => f.path === "app/layout.tsx")
          expect(layout?.content).toContain("Metadata")
          expect(layout?.content).toContain(profile.name)
        })

        it("includes industry-specific section", () => {
          const paths = parseResult.files.map((f) => f.path)
          switch (industry) {
            case "restaurant":
              expect(paths).toContain("components/Menu.tsx")
              break
            case "dental":
            case "salon":
            case "plumber":
              expect(paths).toContain("components/Services.tsx")
              break
            case "lawyer":
              expect(paths).toContain("components/PracticeAreas.tsx")
              break
          }
        })
      })
    }
  })

  // ── 3. Full pipeline integration (mock Claude, real everything else) ──
  describe("Full pipeline integration with mocked Claude API", () => {
    // We can't easily import generateSite because it has deep dependency
    // chains through the real claude module. Instead, test the critical
    // integration: real prompt building → mock response → real parsing.
    for (const [industry, profile] of Object.entries(PROFILES)) {
      it(`${industry}: end-to-end prompt→response→parse succeeds for ${profile.name}`, async () => {
        // Step 1: Build real prompt
        const prompt = await buildGenerationPrompt(profile)
        expect(prompt.system.length).toBeGreaterThan(1000)
        expect(prompt.user).toContain(profile.name)

        // Step 2: Simulate Claude response
        const mockResponse = buildMockResponse(profile)

        // Step 3: Real parse + validate
        const result = parseAndValidate(mockResponse)

        // Step 4: Verify quality
        expect(result.files.length).toBeGreaterThanOrEqual(7)
        const criticalErrors = result.errors.filter(
          (e) => e.type === "missing_file" || e.type === "syntax_error"
        )
        expect(criticalErrors).toEqual([])

        // Step 5: Verify business data is used
        const allContent = result.files.map((f) => f.content).join("\n")
        expect(allContent).toContain(profile.name)
        expect(allContent).toContain(profile.phone)
        expect(allContent).toContain(profile.address)
      })
    }
  })

  // ── 4. Cross-industry comparison ──────────────────────────────
  describe("Cross-industry code quality", () => {
    const allResults: Record<string, ReturnType<typeof parseAndValidate>> = {}

    beforeAll(() => {
      for (const [industry, profile] of Object.entries(PROFILES)) {
        allResults[industry] = parseAndValidate(buildMockResponse(profile))
      }
    })

    it("all 5 industries produce valid output", () => {
      for (const [industry, result] of Object.entries(allResults)) {
        const critical = result.errors.filter((e) => e.type === "missing_file" || e.type === "syntax_error")
        expect(critical).toEqual([])
      }
    })

    it("all industries produce at least 7 files", () => {
      for (const [industry, result] of Object.entries(allResults)) {
        expect(result.files.length).toBeGreaterThanOrEqual(7)
      }
    })

    it("all industries include the 5 required component types", () => {
      for (const result of Object.values(allResults)) {
        const paths = result.files.map((f) => f.path)
        expect(paths).toContain("app/layout.tsx")
        expect(paths).toContain("app/page.tsx")
        expect(paths).toContain("components/Hero.tsx")
        expect(paths).toContain("components/Footer.tsx")
        expect(paths).toContain("tailwind.config.ts")
      }
    })

    it("restaurant has Gallery section (has photos)", () => {
      const paths = allResults.restaurant.files.map((f) => f.path)
      expect(paths).toContain("components/Gallery.tsx")
    })

    it("plumber has no Gallery section (no photos)", () => {
      const paths = allResults.plumber.files.map((f) => f.path)
      expect(paths).not.toContain("components/Gallery.tsx")
    })

    it("each industry has unique hero tagline", () => {
      const heros = Object.entries(allResults).map(([ind, result]) => {
        const hero = result.files.find((f) => f.path === "components/Hero.tsx")
        return hero?.content ?? ""
      })
      // Each should be different from the others
      const uniqueHeros = new Set(heros)
      expect(uniqueHeros.size).toBe(5)
    })
  })
})
