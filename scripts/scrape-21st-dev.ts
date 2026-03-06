/**
 * scripts/scrape-21st-dev.ts
 *
 * Generates JSON documentation files for 21st.dev components.
 * 21st.dev specializes in pre-built sections, full page templates,
 * and component compositions for modern websites.
 *
 * Each file is stored in data/components/21st-dev/<component>.json
 *
 * Usage: npx tsx scripts/scrape-21st-dev.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface ComponentDoc {
  name: string;
  library: string;
  description: string;
  whenToUse: string;
  installation: string;
  props: ComponentProp[];
  codeExample: string;
  tags: string[];
}

const components: ComponentDoc[] = [
  {
    name: "Hero Section",
    library: "21st-dev",
    description:
      "A full-width hero section with headline, subheadline, CTA buttons, and optional background image or gradient. Supports centered and split-layout variants with animated text reveals.",
    whenToUse:
      "Use as the primary above-the-fold section on any landing page or homepage. Ideal for making a strong first impression with a clear value proposition.",
    installation: "npx 21st@latest add hero-section",
    props: [
      {
        name: "headline",
        type: "string",
        default: "undefined",
        description: "The main headline text displayed prominently",
      },
      {
        name: "subheadline",
        type: "string",
        default: "undefined",
        description: "Supporting text below the headline",
      },
      {
        name: "ctaText",
        type: "string",
        default: '"Get Started"',
        description: "Text for the primary call-to-action button",
      },
      {
        name: "ctaLink",
        type: "string",
        default: '"#"',
        description: "Link for the primary CTA button",
      },
      {
        name: "variant",
        type: '"centered" | "split" | "image-bg"',
        default: '"centered"',
        description: "Layout variant for the hero section",
      },
      {
        name: "backgroundImage",
        type: "string",
        default: "undefined",
        description: "Optional background image URL",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for customization",
      },
    ],
    codeExample: `import { HeroSection } from "@/components/ui/hero-section";

export default function Landing() {
  return (
    <HeroSection
      headline="Build Beautiful Websites in Minutes"
      subheadline="AI-powered website generation for local businesses"
      ctaText="Get Started Free"
      ctaLink="/generate"
      variant="centered"
    />
  );
}`,
    tags: ["section", "hero", "landing", "layout", "above-the-fold"],
  },
  {
    name: "Features Grid",
    library: "21st-dev",
    description:
      "A responsive grid layout for showcasing product features or services. Each feature card includes an icon, title, and description with hover effects and optional animations.",
    whenToUse:
      "Use to display a set of features, services, or benefits in a visually organized grid. Works well below the hero section.",
    installation: "npx 21st@latest add features-grid",
    props: [
      {
        name: "features",
        type: "Feature[]",
        default: "[]",
        description:
          "Array of feature objects with icon, title, and description",
      },
      {
        name: "columns",
        type: "2 | 3 | 4",
        default: "3",
        description: "Number of columns in the grid layout",
      },
      {
        name: "variant",
        type: '"card" | "minimal" | "icon-top"',
        default: '"card"',
        description: "Visual style variant for feature items",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description: "Whether to animate features on scroll into view",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { FeaturesGrid } from "@/components/ui/features-grid";
import { Zap, Shield, Clock } from "lucide-react";

const features = [
  { icon: <Zap />, title: "Lightning Fast", description: "Generated in under 60 seconds" },
  { icon: <Shield />, title: "Secure", description: "Enterprise-grade security built in" },
  { icon: <Clock />, title: "Always On", description: "99.9% uptime guaranteed" },
];

export default function Features() {
  return <FeaturesGrid features={features} columns={3} variant="card" />;
}`,
    tags: ["section", "features", "grid", "layout", "cards"],
  },
  {
    name: "Pricing Section",
    library: "21st-dev",
    description:
      "A complete pricing section with tiered pricing cards, feature comparison lists, toggle for monthly/annual billing, and highlighted recommended plan. Includes animated border effects on hover.",
    whenToUse:
      "Use on pricing pages or as a section on landing pages to display subscription plans and pricing tiers.",
    installation: "npx 21st@latest add pricing-section",
    props: [
      {
        name: "plans",
        type: "PricingPlan[]",
        default: "[]",
        description:
          "Array of pricing plans with name, price, features, and CTA",
      },
      {
        name: "showToggle",
        type: "boolean",
        default: "true",
        description: "Show monthly/annual billing toggle",
      },
      {
        name: "highlightedPlan",
        type: "string",
        default: "undefined",
        description: "Name of the plan to visually highlight as recommended",
      },
      {
        name: "currency",
        type: "string",
        default: '"$"',
        description: "Currency symbol to display",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { PricingSection } from "@/components/ui/pricing-section";

const plans = [
  { name: "Free", price: 0, features: ["1 website", "Basic templates"], cta: "Start Free" },
  { name: "Pro", price: 29, features: ["5 websites", "Premium templates", "Custom domain"], cta: "Go Pro", highlighted: true },
  { name: "Agency", price: 99, features: ["Unlimited websites", "White label", "Priority support"], cta: "Contact Sales" },
];

export default function Pricing() {
  return <PricingSection plans={plans} highlightedPlan="Pro" />;
}`,
    tags: ["section", "pricing", "cards", "layout", "conversion"],
  },
  {
    name: "Testimonials Section",
    library: "21st-dev",
    description:
      "A section for displaying customer testimonials and reviews. Supports carousel, grid, and masonry layouts with avatar images, star ratings, and attribution.",
    whenToUse:
      "Use to build social proof by showcasing customer reviews, testimonials, or case study quotes.",
    installation: "npx 21st@latest add testimonials-section",
    props: [
      {
        name: "testimonials",
        type: "Testimonial[]",
        default: "[]",
        description:
          "Array of testimonial objects with quote, author, role, and avatar",
      },
      {
        name: "layout",
        type: '"carousel" | "grid" | "masonry"',
        default: '"carousel"',
        description: "Layout style for displaying testimonials",
      },
      {
        name: "showRating",
        type: "boolean",
        default: "true",
        description: "Whether to show star ratings",
      },
      {
        name: "autoplay",
        type: "boolean",
        default: "true",
        description: "Auto-advance carousel (only applies to carousel layout)",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { TestimonialsSection } from "@/components/ui/testimonials-section";

const testimonials = [
  { quote: "Best investment we've made.", author: "Jane Doe", role: "CEO, Acme Inc", rating: 5 },
  { quote: "Our online presence transformed overnight.", author: "John Smith", role: "Owner, Smith's Bakery", rating: 5 },
];

export default function Reviews() {
  return <TestimonialsSection testimonials={testimonials} layout="carousel" />;
}`,
    tags: ["section", "testimonials", "reviews", "social-proof", "carousel"],
  },
  {
    name: "CTA Section",
    library: "21st-dev",
    description:
      "A call-to-action section with bold headline, supporting text, and prominent action buttons. Supports gradient backgrounds, image overlays, and animated elements.",
    whenToUse:
      "Use as a conversion-focused section, typically placed near the bottom of a page or between content sections to drive user action.",
    installation: "npx 21st@latest add cta-section",
    props: [
      {
        name: "headline",
        type: "string",
        default: "undefined",
        description: "The main CTA headline text",
      },
      {
        name: "description",
        type: "string",
        default: "undefined",
        description: "Supporting description text",
      },
      {
        name: "primaryAction",
        type: "{ text: string; href: string }",
        default: "undefined",
        description: "Primary action button configuration",
      },
      {
        name: "secondaryAction",
        type: "{ text: string; href: string }",
        default: "undefined",
        description: "Optional secondary action button",
      },
      {
        name: "variant",
        type: '"gradient" | "solid" | "image"',
        default: '"gradient"',
        description: "Background style variant",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { CTASection } from "@/components/ui/cta-section";

export default function CallToAction() {
  return (
    <CTASection
      headline="Ready to transform your online presence?"
      description="Get a beautiful website for your business in under 60 seconds."
      primaryAction={{ text: "Get Started Free", href: "/generate" }}
      secondaryAction={{ text: "View Examples", href: "/examples" }}
      variant="gradient"
    />
  );
}`,
    tags: ["section", "cta", "conversion", "action", "layout"],
  },
  {
    name: "Footer Section",
    library: "21st-dev",
    description:
      "A comprehensive website footer with multi-column link groups, social media icons, newsletter signup, contact info, and copyright. Responsive design that stacks on mobile.",
    whenToUse:
      "Use as the bottom section of any website to provide navigation links, contact information, and legal notices.",
    installation: "npx 21st@latest add footer-section",
    props: [
      {
        name: "columns",
        type: "FooterColumn[]",
        default: "[]",
        description: "Array of link group columns with title and links",
      },
      {
        name: "logo",
        type: "React.ReactNode",
        default: "undefined",
        description: "Logo element to display in the footer",
      },
      {
        name: "socialLinks",
        type: "SocialLink[]",
        default: "[]",
        description: "Array of social media links with platform and URL",
      },
      {
        name: "showNewsletter",
        type: "boolean",
        default: "false",
        description: "Whether to show a newsletter signup form",
      },
      {
        name: "copyright",
        type: "string",
        default: "undefined",
        description: "Copyright text to display at the bottom",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { FooterSection } from "@/components/ui/footer-section";

const columns = [
  { title: "Product", links: [{ label: "Features", href: "/features" }, { label: "Pricing", href: "/pricing" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
];

export default function Footer() {
  return (
    <FooterSection
      columns={columns}
      copyright="2024 Radiant Web. All rights reserved."
      socialLinks={[{ platform: "twitter", url: "https://twitter.com" }]}
    />
  );
}`,
    tags: ["section", "footer", "navigation", "layout", "links"],
  },
  {
    name: "Navbar",
    library: "21st-dev",
    description:
      "A responsive navigation bar with logo, menu items, dropdown menus, mobile hamburger menu, and optional CTA button. Supports sticky positioning and scroll-based transparency effects.",
    whenToUse:
      "Use as the primary navigation component at the top of every page. Essential for all website templates.",
    installation: "npx 21st@latest add navbar",
    props: [
      {
        name: "logo",
        type: "React.ReactNode",
        default: "undefined",
        description: "Logo element displayed on the left",
      },
      {
        name: "items",
        type: "NavItem[]",
        default: "[]",
        description: "Array of navigation items with label, href, and optional children for dropdowns",
      },
      {
        name: "ctaButton",
        type: "{ text: string; href: string }",
        default: "undefined",
        description: "Optional CTA button on the right side",
      },
      {
        name: "sticky",
        type: "boolean",
        default: "true",
        description: "Whether the navbar sticks to the top on scroll",
      },
      {
        name: "transparent",
        type: "boolean",
        default: "false",
        description: "Whether to start with a transparent background",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { Navbar } from "@/components/ui/navbar";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: [
    { label: "Web Design", href: "/services/web-design" },
    { label: "SEO", href: "/services/seo" },
  ]},
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <Navbar
      logo={<span className="font-bold text-xl">MyBiz</span>}
      items={navItems}
      ctaButton={{ text: "Book Now", href: "/book" }}
      sticky
    />
  );
}`,
    tags: ["navigation", "header", "menu", "responsive", "layout"],
  },
  {
    name: "Stats Section",
    library: "21st-dev",
    description:
      "A section for displaying key statistics or metrics with animated counting numbers, labels, and optional icons. Numbers animate up when scrolled into view.",
    whenToUse:
      "Use to showcase business metrics, achievements, or key numbers. Great for building credibility with concrete data points.",
    installation: "npx 21st@latest add stats-section",
    props: [
      {
        name: "stats",
        type: "Stat[]",
        default: "[]",
        description:
          "Array of stat objects with value, label, prefix, and suffix",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description: "Whether to animate number counting on scroll",
      },
      {
        name: "variant",
        type: '"inline" | "card" | "minimal"',
        default: '"inline"',
        description: "Visual style variant",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { StatsSection } from "@/components/ui/stats-section";

const stats = [
  { value: 500, suffix: "+", label: "Websites Generated" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 60, suffix: "s", label: "Average Generation Time" },
];

export default function Stats() {
  return <StatsSection stats={stats} animated variant="card" />;
}`,
    tags: ["section", "stats", "numbers", "metrics", "animation"],
  },
  {
    name: "FAQ Section",
    library: "21st-dev",
    description:
      "An FAQ accordion section with expandable question-answer pairs. Supports single or multiple open items, search filtering, and categorized grouping.",
    whenToUse:
      "Use on landing pages, support pages, or pricing pages to address common questions and reduce support inquiries.",
    installation: "npx 21st@latest add faq-section",
    props: [
      {
        name: "items",
        type: "FAQItem[]",
        default: "[]",
        description: "Array of FAQ items with question and answer text",
      },
      {
        name: "allowMultiple",
        type: "boolean",
        default: "false",
        description: "Allow multiple items to be expanded simultaneously",
      },
      {
        name: "showSearch",
        type: "boolean",
        default: "false",
        description: "Show a search/filter input above the FAQ items",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { FAQSection } from "@/components/ui/faq-section";

const faqs = [
  { question: "How long does it take?", answer: "Most websites are generated in under 60 seconds." },
  { question: "Can I edit the website after?", answer: "Yes, you can customize colors, content, and layout." },
  { question: "Is it mobile-friendly?", answer: "All generated websites are fully responsive." },
];

export default function FAQ() {
  return <FAQSection items={faqs} allowMultiple />;
}`,
    tags: ["section", "faq", "accordion", "content", "support"],
  },
  {
    name: "Team Section",
    library: "21st-dev",
    description:
      "A team members section with profile cards featuring photos, names, roles, bios, and social links. Supports grid and carousel layouts with hover effects.",
    whenToUse:
      "Use on about pages or team pages to showcase team members, staff, or key people in the organization.",
    installation: "npx 21st@latest add team-section",
    props: [
      {
        name: "members",
        type: "TeamMember[]",
        default: "[]",
        description:
          "Array of team member objects with name, role, image, bio, and social links",
      },
      {
        name: "layout",
        type: '"grid" | "carousel"',
        default: '"grid"',
        description: "Layout style for displaying team members",
      },
      {
        name: "columns",
        type: "2 | 3 | 4",
        default: "3",
        description: "Number of columns in grid layout",
      },
      {
        name: "showSocial",
        type: "boolean",
        default: "true",
        description: "Whether to show social media links",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { TeamSection } from "@/components/ui/team-section";

const team = [
  { name: "Alice Johnson", role: "Founder & CEO", image: "/team/alice.jpg", bio: "10+ years in web development" },
  { name: "Bob Williams", role: "Lead Designer", image: "/team/bob.jpg", bio: "Award-winning UI/UX designer" },
];

export default function Team() {
  return <TeamSection members={team} layout="grid" columns={3} />;
}`,
    tags: ["section", "team", "people", "cards", "about"],
  },
  {
    name: "Contact Section",
    library: "21st-dev",
    description:
      "A contact section with a form (name, email, message), embedded map, contact details (phone, email, address), and social links. Form includes client-side validation.",
    whenToUse:
      "Use on contact pages or as a section at the bottom of service pages to provide a way for visitors to get in touch.",
    installation: "npx 21st@latest add contact-section",
    props: [
      {
        name: "title",
        type: "string",
        default: '"Get in Touch"',
        description: "Section heading text",
      },
      {
        name: "showMap",
        type: "boolean",
        default: "false",
        description: "Whether to show an embedded map",
      },
      {
        name: "contactInfo",
        type: "ContactInfo",
        default: "undefined",
        description: "Contact details: phone, email, address",
      },
      {
        name: "onSubmit",
        type: "(data: FormData) => Promise<void>",
        default: "undefined",
        description: "Form submission handler",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { ContactSection } from "@/components/ui/contact-section";

export default function Contact() {
  return (
    <ContactSection
      title="Get in Touch"
      contactInfo={{
        phone: "(555) 123-4567",
        email: "hello@mybusiness.com",
        address: "123 Main St, City, ST 12345",
      }}
      onSubmit={async (data) => {
        await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
      }}
    />
  );
}`,
    tags: ["section", "contact", "form", "map", "communication"],
  },
  {
    name: "Gallery Section",
    library: "21st-dev",
    description:
      "A photo gallery section with lightbox viewing, masonry or grid layouts, category filtering, and lazy loading. Supports images and optional captions.",
    whenToUse:
      "Use to showcase photos of products, portfolio items, restaurant dishes, salon transformations, or any visual work.",
    installation: "npx 21st@latest add gallery-section",
    props: [
      {
        name: "images",
        type: "GalleryImage[]",
        default: "[]",
        description:
          "Array of image objects with src, alt, caption, and category",
      },
      {
        name: "layout",
        type: '"grid" | "masonry"',
        default: '"grid"',
        description: "Layout style for the gallery",
      },
      {
        name: "columns",
        type: "2 | 3 | 4",
        default: "3",
        description: "Number of columns",
      },
      {
        name: "lightbox",
        type: "boolean",
        default: "true",
        description: "Enable full-screen lightbox on image click",
      },
      {
        name: "filterable",
        type: "boolean",
        default: "false",
        description: "Show category filter tabs",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { GallerySection } from "@/components/ui/gallery-section";

const images = [
  { src: "/gallery/1.jpg", alt: "Dish 1", caption: "Signature Pasta", category: "entrees" },
  { src: "/gallery/2.jpg", alt: "Dish 2", caption: "Fresh Salad", category: "appetizers" },
  { src: "/gallery/3.jpg", alt: "Interior", caption: "Our Dining Room", category: "ambiance" },
];

export default function Gallery() {
  return <GallerySection images={images} layout="masonry" lightbox filterable />;
}`,
    tags: ["section", "gallery", "images", "lightbox", "masonry"],
  },
  {
    name: "Services Section",
    library: "21st-dev",
    description:
      "A services showcase section with service cards featuring icons, titles, descriptions, and optional pricing or CTA links. Supports list and grid layouts.",
    whenToUse:
      "Use to display business services, menu categories, or product offerings in a structured layout.",
    installation: "npx 21st@latest add services-section",
    props: [
      {
        name: "services",
        type: "Service[]",
        default: "[]",
        description: "Array of service objects with icon, title, description, and optional price",
      },
      {
        name: "layout",
        type: '"grid" | "list" | "alternating"',
        default: '"grid"',
        description: "Layout style for displaying services",
      },
      {
        name: "columns",
        type: "2 | 3",
        default: "3",
        description: "Number of columns in grid layout",
      },
      {
        name: "showPrice",
        type: "boolean",
        default: "false",
        description: "Whether to display pricing on service cards",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { ServicesSection } from "@/components/ui/services-section";
import { Scissors, Paintbrush, Sparkles } from "lucide-react";

const services = [
  { icon: <Scissors />, title: "Haircut", description: "Professional styling", price: "$35" },
  { icon: <Paintbrush />, title: "Color", description: "Full color treatment", price: "$85" },
  { icon: <Sparkles />, title: "Highlights", description: "Natural-looking highlights", price: "$120" },
];

export default function Services() {
  return <ServicesSection services={services} layout="grid" showPrice />;
}`,
    tags: ["section", "services", "cards", "business", "layout"],
  },
  {
    name: "Hours and Location",
    library: "21st-dev",
    description:
      "A section displaying business hours in a formatted table alongside location details with an embedded map. Shows current open/closed status dynamically.",
    whenToUse:
      "Use on local business websites to display operating hours and physical location. Essential for restaurants, salons, clinics, and retail stores.",
    installation: "npx 21st@latest add hours-location",
    props: [
      {
        name: "hours",
        type: "BusinessHours",
        default: "undefined",
        description:
          "Object mapping days to open/close times",
      },
      {
        name: "address",
        type: "string",
        default: "undefined",
        description: "Full street address",
      },
      {
        name: "phone",
        type: "string",
        default: "undefined",
        description: "Contact phone number",
      },
      {
        name: "showMap",
        type: "boolean",
        default: "true",
        description: "Whether to show an embedded map",
      },
      {
        name: "showStatus",
        type: "boolean",
        default: "true",
        description: "Show current open/closed status badge",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { HoursLocation } from "@/components/ui/hours-location";

const hours = {
  monday: { open: "9:00 AM", close: "9:00 PM" },
  tuesday: { open: "9:00 AM", close: "9:00 PM" },
  wednesday: { open: "9:00 AM", close: "9:00 PM" },
  sunday: { open: "10:00 AM", close: "8:00 PM" },
};

export default function Info() {
  return (
    <HoursLocation
      hours={hours}
      address="123 Main Street, City, ST 12345"
      phone="(555) 123-4567"
      showMap
      showStatus
    />
  );
}`,
    tags: ["section", "hours", "location", "map", "business"],
  },
  {
    name: "Menu Grid",
    library: "21st-dev",
    description:
      "A restaurant-style menu grid with categorized items, prices, descriptions, optional photos, and dietary indicators (vegetarian, gluten-free, etc.).",
    whenToUse:
      "Use specifically for restaurant or food business websites to display menu items organized by category.",
    installation: "npx 21st@latest add menu-grid",
    props: [
      {
        name: "categories",
        type: "MenuCategory[]",
        default: "[]",
        description: "Array of menu categories with name and items",
      },
      {
        name: "showImages",
        type: "boolean",
        default: "false",
        description: "Whether to show item images",
      },
      {
        name: "showDietary",
        type: "boolean",
        default: "true",
        description: "Whether to show dietary indicator badges",
      },
      {
        name: "variant",
        type: '"card" | "list" | "elegant"',
        default: '"card"',
        description: "Visual style variant",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { MenuGrid } from "@/components/ui/menu-grid";

const categories = [
  {
    name: "Appetizers",
    items: [
      { name: "Bruschetta", description: "Toasted bread with tomatoes", price: "$12", dietary: ["vegetarian"] },
      { name: "Calamari", description: "Crispy fried squid", price: "$14" },
    ],
  },
  {
    name: "Entrees",
    items: [
      { name: "Grilled Salmon", description: "Atlantic salmon with herbs", price: "$28", dietary: ["gluten-free"] },
    ],
  },
];

export default function Menu() {
  return <MenuGrid categories={categories} variant="elegant" showDietary />;
}`,
    tags: ["section", "menu", "restaurant", "food", "grid"],
  },
  {
    name: "Booking Section",
    library: "21st-dev",
    description:
      "An appointment or reservation booking section with date picker, time slot selection, service selection, and contact form. Supports business-specific booking flows.",
    whenToUse:
      "Use for businesses that take appointments or reservations: restaurants, salons, dentists, doctors, spas.",
    installation: "npx 21st@latest add booking-section",
    props: [
      {
        name: "services",
        type: "BookingService[]",
        default: "[]",
        description: "Array of bookable services with name and duration",
      },
      {
        name: "availableSlots",
        type: "TimeSlot[]",
        default: "[]",
        description: "Available time slots for booking",
      },
      {
        name: "onBook",
        type: "(booking: BookingData) => Promise<void>",
        default: "undefined",
        description: "Callback when a booking is submitted",
      },
      {
        name: "showServiceSelect",
        type: "boolean",
        default: "true",
        description: "Whether to show service selection step",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { BookingSection } from "@/components/ui/booking-section";

const services = [
  { name: "Haircut", duration: 30 },
  { name: "Color & Style", duration: 90 },
  { name: "Consultation", duration: 15 },
];

export default function Booking() {
  return (
    <BookingSection
      services={services}
      onBook={async (data) => {
        await fetch("/api/booking", { method: "POST", body: JSON.stringify(data) });
      }}
      showServiceSelect
    />
  );
}`,
    tags: ["section", "booking", "appointment", "form", "scheduling"],
  },
  {
    name: "Logo Cloud",
    library: "21st-dev",
    description:
      "A section displaying partner, client, or technology logos in a horizontal row or animated marquee. Supports grayscale-to-color hover effects and infinite scroll animation.",
    whenToUse:
      "Use to display trusted brands, partners, or certifications. Often placed below the hero section for credibility.",
    installation: "npx 21st@latest add logo-cloud",
    props: [
      {
        name: "logos",
        type: "Logo[]",
        default: "[]",
        description: "Array of logo objects with src, alt, and optional href",
      },
      {
        name: "animated",
        type: "boolean",
        default: "false",
        description: "Whether to animate logos in a continuous marquee",
      },
      {
        name: "grayscale",
        type: "boolean",
        default: "true",
        description: "Show logos in grayscale with color on hover",
      },
      {
        name: "title",
        type: "string",
        default: '"Trusted by"',
        description: "Section title text",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { LogoCloud } from "@/components/ui/logo-cloud";

const logos = [
  { src: "/logos/google.svg", alt: "Google" },
  { src: "/logos/stripe.svg", alt: "Stripe" },
  { src: "/logos/vercel.svg", alt: "Vercel" },
];

export default function Partners() {
  return <LogoCloud logos={logos} animated grayscale title="Trusted by" />;
}`,
    tags: ["section", "logos", "brands", "trust", "marquee"],
  },
  {
    name: "Blog Section",
    library: "21st-dev",
    description:
      "A blog post listing section with featured post, post cards with thumbnails, excerpts, dates, categories, and read-more links. Supports grid and list layouts.",
    whenToUse:
      "Use on homepages to feature recent blog posts, or on blog index pages to list all articles.",
    installation: "npx 21st@latest add blog-section",
    props: [
      {
        name: "posts",
        type: "BlogPost[]",
        default: "[]",
        description: "Array of blog post objects with title, excerpt, date, image, and slug",
      },
      {
        name: "layout",
        type: '"grid" | "list" | "featured"',
        default: '"grid"',
        description: "Layout style with optional featured first post",
      },
      {
        name: "columns",
        type: "2 | 3",
        default: "3",
        description: "Number of columns in grid layout",
      },
      {
        name: "showCategory",
        type: "boolean",
        default: "true",
        description: "Whether to show category labels on posts",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { BlogSection } from "@/components/ui/blog-section";

const posts = [
  { title: "Getting Started", excerpt: "Learn how to build your first website.", date: "2024-01-15", slug: "/blog/getting-started", image: "/blog/1.jpg", category: "Tutorial" },
  { title: "Design Tips", excerpt: "5 design principles for local businesses.", date: "2024-01-10", slug: "/blog/design-tips", image: "/blog/2.jpg", category: "Design" },
];

export default function Blog() {
  return <BlogSection posts={posts} layout="featured" showCategory />;
}`,
    tags: ["section", "blog", "content", "articles", "cards"],
  },
  {
    name: "Banner",
    library: "21st-dev",
    description:
      "A dismissible announcement banner that sits at the top of the page. Supports links, countdown timers, and gradient or solid backgrounds. Commonly used for promotions or announcements.",
    whenToUse:
      "Use at the top of a site to announce sales, events, new features, or important updates. Can be dismissed by the visitor.",
    installation: "npx 21st@latest add banner",
    props: [
      {
        name: "text",
        type: "string",
        default: "undefined",
        description: "Banner announcement text",
      },
      {
        name: "link",
        type: "{ text: string; href: string }",
        default: "undefined",
        description: "Optional link within the banner",
      },
      {
        name: "dismissible",
        type: "boolean",
        default: "true",
        description: "Whether the banner can be dismissed",
      },
      {
        name: "variant",
        type: '"info" | "warning" | "success" | "gradient"',
        default: '"info"',
        description: "Visual style variant",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { Banner } from "@/components/ui/banner";

export default function TopBanner() {
  return (
    <Banner
      text="Grand Opening Special: 20% off all services this week!"
      link={{ text: "Book Now", href: "/book" }}
      variant="gradient"
      dismissible
    />
  );
}`,
    tags: ["component", "banner", "announcement", "notification", "promotion"],
  },
  {
    name: "Before After Slider",
    library: "21st-dev",
    description:
      "An interactive comparison slider that lets users drag to compare two images side by side. Supports horizontal and vertical orientations with smooth drag interaction.",
    whenToUse:
      "Use for before/after comparisons: salon transformations, renovation projects, design comparisons, or product improvements.",
    installation: "npx 21st@latest add before-after-slider",
    props: [
      {
        name: "beforeImage",
        type: "string",
        default: "undefined",
        description: "URL of the 'before' image",
      },
      {
        name: "afterImage",
        type: "string",
        default: "undefined",
        description: "URL of the 'after' image",
      },
      {
        name: "beforeLabel",
        type: "string",
        default: '"Before"',
        description: "Label for the before side",
      },
      {
        name: "afterLabel",
        type: "string",
        default: '"After"',
        description: "Label for the after side",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Direction of the comparison slider",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

export default function Comparison() {
  return (
    <BeforeAfterSlider
      beforeImage="/before.jpg"
      afterImage="/after.jpg"
      beforeLabel="Before"
      afterLabel="After"
      orientation="horizontal"
    />
  );
}`,
    tags: ["component", "comparison", "slider", "images", "interactive"],
  },
  {
    name: "Announcement Card",
    library: "21st-dev",
    description:
      "A prominent card component for highlighting announcements, special offers, or events. Features icon, title, description, date, and action button with optional animated border.",
    whenToUse:
      "Use to highlight special promotions, upcoming events, or important announcements on a business website.",
    installation: "npx 21st@latest add announcement-card",
    props: [
      {
        name: "title",
        type: "string",
        default: "undefined",
        description: "Card title text",
      },
      {
        name: "description",
        type: "string",
        default: "undefined",
        description: "Card description or body text",
      },
      {
        name: "date",
        type: "string",
        default: "undefined",
        description: "Event or announcement date",
      },
      {
        name: "action",
        type: "{ text: string; href: string }",
        default: "undefined",
        description: "Action button configuration",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        default: "undefined",
        description: "Icon element displayed in the card",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { AnnouncementCard } from "@/components/ui/announcement-card";
import { Calendar } from "lucide-react";

export default function Announcement() {
  return (
    <AnnouncementCard
      icon={<Calendar />}
      title="Holiday Hours"
      description="We'll be closed Dec 24-25 and open reduced hours Dec 26-31."
      date="December 2024"
      action={{ text: "View Details", href: "/holiday-hours" }}
    />
  );
}`,
    tags: ["component", "card", "announcement", "event", "promotion"],
  },
  {
    name: "Review Card",
    library: "21st-dev",
    description:
      "A styled card for displaying individual customer reviews with star rating, reviewer name, date, verified badge, and review text. Supports Google Reviews style formatting.",
    whenToUse:
      "Use to display individual reviews from Google, Yelp, or custom sources. Can be used inside testimonials sections or standalone.",
    installation: "npx 21st@latest add review-card",
    props: [
      {
        name: "author",
        type: "string",
        default: "undefined",
        description: "Reviewer's name",
      },
      {
        name: "rating",
        type: "number",
        default: "5",
        description: "Star rating (1-5)",
      },
      {
        name: "text",
        type: "string",
        default: "undefined",
        description: "Review text content",
      },
      {
        name: "date",
        type: "string",
        default: "undefined",
        description: "Date of the review",
      },
      {
        name: "verified",
        type: "boolean",
        default: "false",
        description: "Whether to show a verified badge",
      },
      {
        name: "avatar",
        type: "string",
        default: "undefined",
        description: "Reviewer avatar image URL",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { ReviewCard } from "@/components/ui/review-card";

export default function Review() {
  return (
    <ReviewCard
      author="Sarah M."
      rating={5}
      text="Amazing experience! The staff was incredibly friendly and professional."
      date="2 weeks ago"
      verified
    />
  );
}`,
    tags: ["component", "review", "card", "rating", "social-proof"],
  },
  {
    name: "Map Embed",
    library: "21st-dev",
    description:
      "A styled Google Maps or Mapbox embed wrapper with customizable markers, info windows, dark mode support, and responsive sizing. Includes a location pin and address overlay.",
    whenToUse:
      "Use to display a business location on a map. Essential for local businesses, restaurants, and service providers.",
    installation: "npx 21st@latest add map-embed",
    props: [
      {
        name: "address",
        type: "string",
        default: "undefined",
        description: "Address to display on the map",
      },
      {
        name: "lat",
        type: "number",
        default: "undefined",
        description: "Latitude coordinate",
      },
      {
        name: "lng",
        type: "number",
        default: "undefined",
        description: "Longitude coordinate",
      },
      {
        name: "zoom",
        type: "number",
        default: "15",
        description: "Map zoom level",
      },
      {
        name: "darkMode",
        type: "boolean",
        default: "false",
        description: "Whether to use dark map theme",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { MapEmbed } from "@/components/ui/map-embed";

export default function Location() {
  return (
    <MapEmbed
      address="123 Main Street, New York, NY 10001"
      lat={40.7128}
      lng={-74.006}
      zoom={15}
    />
  );
}`,
    tags: ["component", "map", "location", "embed", "business"],
  },
  {
    name: "Social Proof Bar",
    library: "21st-dev",
    description:
      "A compact social proof bar showing aggregate ratings, review counts, and trust badges from platforms like Google, Yelp, and Facebook. Supports animated number reveals.",
    whenToUse:
      "Use near the hero section or above the fold to quickly establish trust with aggregate review data.",
    installation: "npx 21st@latest add social-proof-bar",
    props: [
      {
        name: "rating",
        type: "number",
        default: "undefined",
        description: "Average star rating",
      },
      {
        name: "reviewCount",
        type: "number",
        default: "undefined",
        description: "Total number of reviews",
      },
      {
        name: "platforms",
        type: "string[]",
        default: "[]",
        description: "List of platforms to show badges for (e.g., 'google', 'yelp')",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description: "Whether to animate numbers on appearance",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { SocialProofBar } from "@/components/ui/social-proof-bar";

export default function Proof() {
  return (
    <SocialProofBar
      rating={4.8}
      reviewCount={342}
      platforms={["google", "yelp"]}
      animated
    />
  );
}`,
    tags: ["component", "social-proof", "rating", "trust", "reviews"],
  },
  {
    name: "Page Template Restaurant",
    library: "21st-dev",
    description:
      "A complete restaurant page template that composes hero, menu, hours/location, reviews, gallery, reservation CTA, and footer sections into a cohesive single-page website.",
    whenToUse:
      "Use as a full-page template for restaurant businesses. Provides a complete, ready-to-customize page structure.",
    installation: "npx 21st@latest add page-template-restaurant",
    props: [
      {
        name: "businessData",
        type: "RestaurantData",
        default: "undefined",
        description: "Complete business data object including name, menu, hours, reviews, photos",
      },
      {
        name: "theme",
        type: "ThemeConfig",
        default: "undefined",
        description: "Theme configuration with colors, fonts, and style preferences",
      },
      {
        name: "sections",
        type: "string[]",
        default: '["hero", "menu", "hours", "reviews", "gallery", "cta", "footer"]',
        description: "Ordered list of sections to include",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { PageTemplateRestaurant } from "@/components/ui/page-template-restaurant";

export default function RestaurantPage({ data }: { data: RestaurantData }) {
  return (
    <PageTemplateRestaurant
      businessData={data}
      theme={{ primary: "#D4382C", secondary: "#F5E6CC", font: "serif" }}
      sections={["hero", "menu", "hours", "reviews", "gallery", "cta", "footer"]}
    />
  );
}`,
    tags: ["template", "restaurant", "full-page", "composition", "business"],
  },
  {
    name: "Page Template Service",
    library: "21st-dev",
    description:
      "A complete service business page template that composes hero, services, about, testimonials, booking, FAQ, and footer into a cohesive single-page website. Suitable for salons, dentists, plumbers, lawyers.",
    whenToUse:
      "Use as a full-page template for service-based businesses like salons, dental offices, law firms, or home services.",
    installation: "npx 21st@latest add page-template-service",
    props: [
      {
        name: "businessData",
        type: "ServiceBusinessData",
        default: "undefined",
        description: "Complete business data including name, services, hours, reviews",
      },
      {
        name: "theme",
        type: "ThemeConfig",
        default: "undefined",
        description: "Theme configuration with colors, fonts, and style preferences",
      },
      {
        name: "sections",
        type: "string[]",
        default: '["hero", "services", "about", "testimonials", "booking", "faq", "footer"]',
        description: "Ordered list of sections to include",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { PageTemplateService } from "@/components/ui/page-template-service";

export default function ServicePage({ data }: { data: ServiceBusinessData }) {
  return (
    <PageTemplateService
      businessData={data}
      theme={{ primary: "#1A365D", secondary: "#EDF2F7", font: "sans-serif" }}
      sections={["hero", "services", "about", "testimonials", "booking", "faq", "footer"]}
    />
  );
}`,
    tags: ["template", "service", "full-page", "composition", "business"],
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function main() {
  const outDir = join(process.cwd(), "data", "components", "21st-dev");
  mkdirSync(outDir, { recursive: true });

  for (const component of components) {
    const slug = slugify(component.name);
    const filePath = join(outDir, `${slug}.json`);
    writeFileSync(filePath, JSON.stringify(component, null, 2) + "\n");
  }

  console.log(
    `Successfully wrote ${components.length} 21st.dev component docs to ${outDir}`
  );
}

main();
