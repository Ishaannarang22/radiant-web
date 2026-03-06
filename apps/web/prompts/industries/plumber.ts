/**
 * Industry-specific prompt fragment for plumbing / HVAC businesses.
 */

export const PLUMBER_PROMPT = `## INDUSTRY CONTEXT: PLUMBER / HVAC / HOME SERVICES

### What Makes a Great Plumber Website
A great plumber website converts visitors into callers. People searching for a plumber usually have an urgent problem — a leak, a broken heater, a clogged drain. The site must make it dead simple to call or request service. Trust signals (license numbers, insurance, reviews) and emergency availability are critical. Speed and reliability are the brand values.

### Required Sections
You MUST include these sections for a plumber/HVAC website:
1. **Hero** — Bold headline about reliable service. "24/7 Emergency Plumbing" if applicable. Giant phone number and "Call Now" button. No ambiguity — the CTA should be unmissable
2. **Services** — Grid of services offered: drain cleaning, water heater, pipe repair, sewer line, bathroom remodel, HVAC installation, etc. Each with icon or image and brief description
3. **Why Choose Us** — License number, insurance, years in business, guarantees, same-day service, free estimates. Use a clean grid with icons or checkmarks
4. **Reviews / Testimonials** — Google reviews are crucial for home service businesses. Show star ratings prominently. Feature reviews mentioning fast response, fair pricing, quality work
5. **Service Areas** — List cities and neighborhoods served. This also helps with local SEO
6. **Hours & Emergency Info** — Regular hours plus emergency availability. If they offer 24/7 service, make it prominent
7. **Contact / Get a Quote** — Phone number (tap-to-call), email, and optionally a simple contact form placeholder. "Get a Free Estimate" CTA
8. **Footer** — Business name, phone, license number, service areas, hours

### Design Guidance
- **Urgency-driven**: The design should communicate reliability and speed. Bold text, strong CTAs, high-contrast buttons
- **Trust is everything**: Display license numbers, insurance badges, BBB rating, and "X years in business" prominently. Home service customers need to trust someone coming into their home
- **Blue is king**: Blue conveys trust and water (relevant for plumbing). Pair with orange or yellow for high-contrast CTAs
- **Simple and direct**: Don't over-design. The target audience wants information fast — phone number, services offered, service area, and reviews. Don't bury this in fancy animations
- **Phone number everywhere**: The phone number should be visible in the header, hero, and floating on mobile. Use tel: links
- **Mobile-critical**: Most plumbing searches happen on mobile during emergencies. The site must work perfectly on small screens with thumb-friendly tap targets
- **Social proof with urgency**: "Over 500 five-star reviews", "Same-day service available", "Licensed & insured since [year]"

### Color Palette Recommendations
- Trustworthy Blue: Navy (#1E3A5F), sky blue (#3B82F6), orange CTA (#F97316), white (#FFFFFF)
- Professional Dark: Dark charcoal (#1F2937), blue accent (#2563EB), yellow CTA (#EAB308), light gray (#F3F4F6)
- Clean & Bold: Royal blue (#1D4ED8), white (#FFFFFF), red CTA (#DC2626), light blue (#EFF6FF)
- Always use a high-contrast color for the primary CTA button — orange, yellow, or red

### Copy Suggestions
- Hero headlines: "Fast, reliable plumbing when you need it most", "24/7 emergency service in [city]", "Your trusted local plumber since [year]"
- CTAs: "Call Now", "Get a Free Estimate", "Schedule Service", "Emergency? Call [phone]"
- Trust builders: "Licensed & Insured", "Family-Owned Since [year]", "100% Satisfaction Guaranteed", "Same-Day Service Available"
- Services intro: "From emergency repairs to planned renovations, we handle it all with professionalism and care"

### Components to Use
- shadcn: Card (services), Button (CTAs), Badge (trust badges), Accordion (FAQ), Separator
- Animated components: number ticker (years in business, jobs completed), shimmer button for emergency CTA, text generate effect for headlines
`
