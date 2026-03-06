/**
 * Industry-specific prompt fragment for dental practices.
 */

export const DENTAL_PROMPT = `## INDUSTRY CONTEXT: DENTAL PRACTICE

### What Makes a Great Dental Website
A great dental website builds trust immediately. Visitors are often anxious about dental visits, so the site must feel clean, professional, and reassuring. Showcase the team, highlight modern technology, and make booking an appointment effortless. Insurance acceptance and emergency availability should be prominent.

### Required Sections
You MUST include these sections for a dental website:
1. **Hero** — Clean, professional image or gradient. Show the practice name, tagline ("Your smile is our priority"), and a prominent "Book Appointment" CTA
2. **Services** — List dental services in a grid or card layout: cleanings, fillings, crowns, implants, cosmetic dentistry, orthodontics, emergency care. Each with a brief description
3. **About / Meet the Team** — Doctor bios with credentials, photos if available. Emphasize experience, education, and caring approach
4. **Patient Reviews** — Real Google reviews prominently displayed. Star ratings build trust for healthcare decisions
5. **Hours & Location** — Clear hours, address, phone. Highlight emergency hours or weekend availability if applicable
6. **Insurance & Payment** — List accepted insurance providers or mention flexible payment options. This is a key decision factor for dental patients
7. **Contact / Book Appointment** — Large, prominent CTA. Phone number, online booking link. Consider a floating "Book Now" button
8. **Footer** — Practice name, address, phone, emergency number, hours

### Design Guidance
- **Clean and clinical**: Use lots of white space. The site should feel as clean as a modern dental office
- **Trust signals everywhere**: Credentials, years in practice, number of patients served, before/after photos, certifications
- **Calming colors**: Soft blues, teals, and whites are standard for dental. They convey cleanliness and calm. Avoid harsh reds or dark colors
- **Professional photography**: If team photos are available, feature them prominently. Smiling dentists and staff build trust
- **Typography**: Clean, modern sans-serif fonts. Nothing too trendy — professionalism is key
- **Prominent CTAs**: "Book Appointment" should appear at least 3 times on the page — hero, mid-page, and near footer. Use a contrasting color for the CTA button
- **Mobile-first**: Many patients search on their phone. The phone number should be tap-to-call and the booking CTA should be sticky on mobile

### Color Palette Recommendations
- Clinical Clean: Soft blue (#4A90D9), white (#FFFFFF), light gray (#F5F7FA), teal accent (#0EA5E9)
- Warm & Modern: Navy (#1E3A5F), warm white (#FBF9F6), gold accent (#D4A853)
- Fresh & Friendly: Teal (#0D9488), mint (#ECFDF5), coral accent (#F87171)
- Choose warm if the practice emphasizes family/comfort, clinical if they emphasize technology/expertise

### Copy Suggestions
- Hero headlines: "Your smile deserves the best care", "Modern dentistry, compassionate care", "Gentle dental care for the whole family"
- CTAs: "Book Your Appointment", "Schedule a Visit", "Call Us Today", "Request an Appointment"
- Trust builders: "Over [X] years of experience", "Serving [city] families since [year]", "[X]+ five-star reviews"
- Services intro: "From routine cleanings to advanced cosmetic procedures, we provide comprehensive dental care"

### Components to Use
- shadcn: Card (services), Accordion (FAQ), Badge (insurance logos), Button (CTAs), Avatar (team photos)
- Animated components: text generate effect for headlines, blur fade for content reveals, number ticker for stats, shimmer button for primary CTA
`
