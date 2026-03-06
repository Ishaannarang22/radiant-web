/**
 * Industry-specific prompt fragment for general/unrecognized businesses.
 * Used as fallback when no specific industry template matches.
 */

export const GENERIC_PROMPT = `## INDUSTRY CONTEXT: GENERAL BUSINESS

### What Makes a Great Business Website
A great business website clearly communicates what the business does, why customers should choose them, and how to get in touch. It builds credibility through reviews, showcases services or products, and makes the next step obvious. When the industry is unknown, focus on universally effective patterns: clear value proposition, social proof, and strong calls to action.

### Required Sections
You MUST include these sections:
1. **Hero** — Clear value proposition with the business name. What they do, where they're located, and a CTA to contact or learn more
2. **Services / What We Offer** — Overview of services or products in a grid or card layout. Each with a brief description
3. **About Us** — Business story, mission, team. What sets them apart from competitors
4. **Reviews / Testimonials** — Google reviews build trust regardless of industry. Show star ratings and quotes
5. **Why Choose Us** — Differentiators: experience, quality, local knowledge, guarantees, awards
6. **Hours & Location** — Business hours, address, directions
7. **Contact CTA** — Phone number, email, and a clear call to action. "Get in Touch", "Call Today", "Request a Quote"
8. **Footer** — Business name, address, phone, hours, links

### Design Guidance
- **Professional and clean**: When in doubt, go clean and professional. White backgrounds, clear typography, well-organized sections
- **Let content lead**: Without a specific industry aesthetic, focus on making the content shine through great typography and spacing
- **Responsive and accessible**: Universal best practices — mobile-friendly, keyboard accessible, fast loading
- **Consistent color palette**: Pick 2-3 colors that work well together. Use the primary for headers and CTAs, secondary for backgrounds, accent for highlights
- **Photography**: Use any available photos. If none, use gradient backgrounds and decorative patterns — never placeholder images
- **Clear hierarchy**: Each section should have a clear heading, brief description, and visual content (cards, icons, or images)

### Color Palette Recommendations
- Professional Blue: Blue (#2563EB), white (#FFFFFF), light blue (#EFF6FF), amber accent (#F59E0B)
- Warm Neutral: Stone (#78716C), warm white (#FAF9F6), orange accent (#D97706)
- Bold Modern: Purple (#7C3AED), light purple (#F5F3FF), pink accent (#EC4899)
- Choose based on the business personality. When unsure, professional blue is always safe

### Copy Suggestions
- Hero headlines: "Welcome to [business name]", "Your trusted partner in [city]", "Quality service, every time"
- CTAs: "Get Started", "Contact Us", "Learn More", "Call Today", "Request a Quote"
- About: Focus on what makes them different, how long they've been in business, and their commitment to customers
- Reviews: Feature the most specific, detailed reviews. Generic "great service" reviews are less compelling than specific stories

### Components to Use
- shadcn: Card (services), Button (CTAs), Badge (trust badges), Accordion (FAQ), Separator, Avatar (team)
- Animated components: hero highlight, text generate effect, bento grid, number ticker, shimmer button, blur fade
`
