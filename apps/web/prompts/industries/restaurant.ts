/**
 * Industry-specific prompt fragment for restaurant / food service businesses.
 */

export const RESTAURANT_PROMPT = `## INDUSTRY CONTEXT: RESTAURANT / FOOD SERVICE

### What Makes a Great Restaurant Website
A great restaurant website makes visitors hungry. It puts food front and center, makes the menu easy to browse, and gets people to call, book, or walk in. The atmosphere should come through in every design choice — colors, fonts, imagery, spacing. Visitors decide in seconds whether this looks like a place they want to eat.

### Required Sections
You MUST include these sections for a restaurant website:
1. **Hero** — Full-width food photography (or a warm gradient if no photos). Show the restaurant name, cuisine type, and a CTA like "View Menu" or "Reserve a Table"
2. **Menu** — Display menu items in an organized grid or tabbed layout. Group by category (appetizers, mains, desserts, drinks). Show item names, descriptions, and prices if available. Use Card components for each item
3. **About / Our Story** — The restaurant's history, philosophy, or chef's story. Keep it personal and warm
4. **Hours & Location** — Clear display of business hours and address. Include a "Get Directions" link. Format hours in a clean table or list
5. **Reviews / Testimonials** — Show real Google reviews with star ratings. These build trust and make people hungry
6. **Gallery** — Food photos, interior shots, ambiance photos. Use a grid or masonry layout
7. **Contact / Reservation CTA** — Phone number, online ordering link, or reservation button. Make it impossible to miss
8. **Footer** — Business name, address, phone, hours summary, and social links

### Design Guidance
- **Atmosphere first**: The website should feel like walking into the restaurant. Warm, inviting, appetizing
- **Photography is everything**: If photos are available, make them large, full-bleed, and mouth-watering. Use them as section backgrounds with dark overlays for text
- **Warm color palette**: Use rich, appetizing colors — deep reds, warm oranges, earthy greens, cream/ivory backgrounds. Avoid cold blues or sterile whites
- **Typography**: Use a distinctive display font for the restaurant name and headings (serif fonts convey elegance, hand-drawn fonts convey casual). Body text should be highly readable
- **Spacing**: Generous padding between sections. Let the food breathe. Don't cram content
- **Menu layout**: Use cards with subtle hover effects. If there are many items, use tabs or accordion to organize by category
- **Dark sections**: Alternate between light and dark background sections. Dark sections with food photos look especially inviting

### Color Palette Recommendations
- Classic Italian: Deep red (#D4382C), cream (#F5E6CC), forest green (#2D5016)
- Modern Upscale: Dark navy (#1A1A2E), warm gold (#C4A35A), ivory (#FAFAF8)
- Fresh & Casual: Vibrant orange (#E85D26), clean white (#FFFFFF), garden green (#3D8B37)
- Choose based on the restaurant's cuisine and vibe. Fine dining = darker, more elegant. Casual = brighter, more playful

### Copy Suggestions
- Hero headlines: "Authentic [cuisine] in the heart of [city]", "Where every meal tells a story", "A taste of [cuisine] you won't forget"
- CTAs: "Reserve a Table", "View Our Menu", "Order Online", "Call to Book"
- About section: Tell the story of the food, the family, the passion. Use sensory language
- Reviews: Pull the most appetizing quotes. Highlight mentions of specific dishes

### Components to Use
- shadcn: Card (menu items), Tabs (menu categories), Badge (dietary labels), Carousel (gallery), Separator
- Animated components: parallax hero, sticky scroll for menu, marquee for specials, number ticker for stats (years open, dishes served)
`
