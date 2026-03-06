/**
 * Industry-specific prompt fragment for law firms and legal services.
 */

export const LAWYER_PROMPT = `## INDUSTRY CONTEXT: LAW FIRM / LEGAL SERVICES

### What Makes a Great Law Firm Website
A great law firm website exudes authority, competence, and trustworthiness. Potential clients are often stressed and need reassurance that they're choosing the right attorney. The site must clearly communicate practice areas, attorney credentials, and track record. A "Free Consultation" CTA is standard and expected. The design should be polished and professional — never flashy or gimmicky.

### Required Sections
You MUST include these sections for a law firm website:
1. **Hero** — Authoritative headline emphasizing results and experience. Practice name, key practice areas, and "Free Consultation" CTA. Professional, serious tone
2. **Practice Areas** — Clear list of legal specialties: personal injury, family law, criminal defense, estate planning, business law, etc. Each with a brief description of what they handle
3. **About / Attorney Profiles** — Detailed bios: education, bar admissions, years of experience, notable cases or results, professional memberships. Photos if available
4. **Results / Case Studies** — Settlement amounts, verdicts, or case outcomes (if available). "Over $X million recovered" or "X cases won" type statistics
5. **Client Testimonials** — Reviews emphasizing professionalism, communication, and outcomes. Legal clients value feeling heard and getting results
6. **Why Choose Us** — Differentiators: free consultation, no fee unless you win (contingency), years of experience, local knowledge, personal attention
7. **Contact / Free Consultation CTA** — Phone number, email, consultation booking. Make it clear that initial consultation is free (if applicable)
8. **Footer** — Firm name, address, phone, practice areas, disclaimer ("This website is for informational purposes only and does not constitute legal advice")

### Design Guidance
- **Authority and sophistication**: The design should communicate gravitas. Think law office, not startup. Clean lines, structured layouts, professional typography
- **Dark and commanding**: Dark color schemes (navy, charcoal, dark green) convey authority. Gold or brass accents suggest premium quality
- **Conservative typography**: Use serif fonts for headings — they convey tradition, authority, and trustworthiness. Clean sans-serif for body text. No playful or casual fonts
- **Structured layout**: Use clear visual hierarchy. Organized grids for practice areas. Clean cards for attorney profiles. Nothing cluttered or chaotic
- **Minimal animation**: Subtle transitions are fine, but avoid flashy effects. Law firm websites should feel stable and serious
- **Prominent credentials**: Display bar associations, awards, Super Lawyers badges, Martindale-Hubbell ratings. These matter enormously in legal
- **Disclaimer**: Include a legal disclaimer in the footer. This is industry-standard and often required by bar associations

### Color Palette Recommendations
- Classic Authority: Navy (#1B2A4A), gold (#C4A35A), ivory (#FAF8F5), charcoal text (#1E293B)
- Modern Professional: Dark slate (#0F172A), steel blue (#475569), amber accent (#D97706), white (#FFFFFF)
- Traditional: Forest green (#14532D), cream (#FFFBEB), gold (#B8860B), dark text (#1A1A1A)
- Law firms almost never use bright colors. Stick to dark, muted, authoritative tones

### Copy Suggestions
- Hero headlines: "Fighting for justice in [city]", "Experienced legal representation you can trust", "Protecting your rights since [year]"
- CTAs: "Free Consultation", "Schedule Your Free Case Review", "Call Us Today", "Get Legal Help Now"
- Trust builders: "Over [X] years of combined experience", "$[X]M+ recovered for our clients", "No fee unless we win"
- Practice areas intro: "Our attorneys bring decades of experience across a range of legal specialties, providing dedicated representation for every client"

### Components to Use
- shadcn: Card (practice areas, attorney bios), Accordion (FAQ, practice area details), Badge (credentials), Button (CTAs), Separator
- Animated components: text generate effect for headline, number ticker for case results/stats, blur fade for section reveals
`
