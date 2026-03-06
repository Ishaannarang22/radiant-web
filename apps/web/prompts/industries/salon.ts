/**
 * Industry-specific prompt fragment for salons and barbershops.
 */

export const SALON_PROMPT = `## INDUSTRY CONTEXT: SALON / BARBERSHOP / SPA

### What Makes a Great Salon Website
A great salon website is visually stunning and reflects the artistry of the business. It should feel aspirational — visitors should see the site and immediately want to book. Showcase transformations, highlight the team's expertise, and make booking seamless. The design itself should demonstrate the salon's sense of style.

### Required Sections
You MUST include these sections for a salon website:
1. **Hero** — Striking visual that showcases the salon's work. Use photos of hairstyles, the salon interior, or a stylish gradient. Include salon name and "Book Now" CTA
2. **Services & Pricing** — List all services with prices in a clean grid or table. Group by category (cuts, color, treatments, nails, spa). Use Card components
3. **About / Meet the Team** — Stylist bios with specialties. If photos available, show them. Emphasize training, certifications, and style expertise
4. **Gallery / Portfolio** — Before/after photos, style showcases, salon interior. This is the most important trust builder — let the work speak for itself
5. **Reviews / Testimonials** — Google reviews with focus on service quality and stylist mentions
6. **Hours & Location** — Clear schedule, walk-in availability, address with parking info
7. **Book Appointment CTA** — Prominent booking link. Phone number for calls. Consider mentioning online booking platforms
8. **Footer** — Salon name, address, phone, hours, social media links (Instagram is especially important for salons)

### Design Guidance
- **Fashion-forward**: The website design should reflect current design trends. If the salon is trendy, the site should be too
- **High-contrast imagery**: Use dramatic photography — dark backgrounds with highlighted subjects, moody lighting, editorial-style shots
- **Instagram aesthetic**: Many salons live on Instagram. Mirror that polished, curated visual language on the website
- **Typography**: Use a combination of an elegant display font for the name/headings and a clean sans-serif for body text. Script fonts can work for salon names but keep them legible
- **Color palette**: Depends on the brand — elegant salons use black/white/gold, modern salons use blush/mauve/sage, barbershops use dark/masculine tones
- **Whitespace**: Generous spacing. Let the portfolio images and design elements breathe
- **Social proof**: Feature Instagram feed or link prominently. For salons, visual social proof is more powerful than text reviews

### Color Palette Recommendations
- Luxe Salon: Black (#1A1A1A), blush pink (#F5E6E0), gold accent (#C4A35A), white (#FFFFFF)
- Modern Minimal: Charcoal (#2D2D2D), sage green (#A8B5A0), cream (#FFF8F0)
- Classic Barbershop: Navy (#1B2A4A), burgundy (#8B2252), cream (#F5F0E8), gold (#D4A853)
- Choose based on the salon's brand — edgy, classic, or luxurious

### Copy Suggestions
- Hero headlines: "Where style meets artistry", "Look your best, feel your best", "Your transformation starts here"
- CTAs: "Book Your Appointment", "Schedule a Visit", "View Our Work", "Call to Book"
- Services intro: "From precision cuts to stunning color transformations, our team of experts is here to help you look and feel amazing"
- About: Emphasize the creative talent, years of experience, ongoing education, and passion for beauty

### Components to Use
- shadcn: Card (services/pricing), Tabs (service categories), Avatar (stylist profiles), Badge (specialty tags), Separator
- Animated components: parallax hero, bento grid for portfolio, card hover effects, glare card for featured styles, blur fade for reveals
`
