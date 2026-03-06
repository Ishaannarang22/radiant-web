/**
 * scripts/scrape-aceternity.ts
 *
 * Generates JSON documentation files for Aceternity UI components.
 * Each file is stored in data/components/aceternity/<component>.json
 *
 * Usage: npx tsx scripts/scrape-aceternity.ts
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
    name: "3D Card Effect",
    library: "aceternity",
    description:
      "A card component with interactive 3D tilt/rotation effect that responds to mouse movement, creating depth and perspective.",
    whenToUse:
      "Use for featured content cards, product showcases, or portfolio items where you want an engaging hover interaction.",
    installation: "npx aceternity-ui@latest add 3d-card-effect",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the 3D card container",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer perspective container",
      },
    ],
    codeExample: `import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          Make things float in air
        </CardItem>
        <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img src="/placeholder.jpg" className="h-60 w-full object-cover rounded-xl" alt="thumbnail" />
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}`,
    tags: ["card", "3d", "hover", "interactive", "perspective", "animation"],
  },
  {
    name: "3D Pin",
    library: "aceternity",
    description:
      "An animated 3D pin component that appears to float above the surface with a connecting line, useful for map-like interfaces or highlighting locations.",
    whenToUse:
      "Use for location indicators, map pins, featured location highlights, or any UI that needs a floating pin aesthetic.",
    installation: "npx aceternity-ui@latest add 3d-pin",
    props: [
      {
        name: "title",
        type: "string | React.ReactNode",
        default: "undefined",
        description: "Content displayed in the pin popup",
      },
      {
        name: "href",
        type: "string",
        default: "undefined",
        description: "Link URL when pin is clicked",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the pin container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer wrapper",
      },
    ],
    codeExample: `import { PinContainer } from "@/components/ui/3d-pin"

export function AnimatedPinDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <PinContainer title="Visit" href="https://example.com">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Aceternity UI
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
        </div>
      </PinContainer>
    </div>
  )
}`,
    tags: ["pin", "3d", "location", "map", "floating", "animation"],
  },
  {
    name: "Aurora Background",
    library: "aceternity",
    description:
      "A mesmerizing aurora borealis-style animated background with flowing gradient colors and smooth transitions.",
    whenToUse:
      "Use as a full-page background for hero sections, landing pages, or any section that needs an eye-catching animated gradient background.",
    installation: "npx aceternity-ui@latest add aurora-background",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render on top of the aurora background",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
      {
        name: "showRadialGradient",
        type: "boolean",
        default: "true",
        description: "Whether to show the radial gradient overlay",
      },
    ],
    codeExample: `import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "framer-motion"

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Background lights are cool you know.
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical.
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Debug now
        </button>
      </motion.div>
    </AuroraBackground>
  )
}`,
    tags: ["background", "aurora", "gradient", "animation", "hero"],
  },
  {
    name: "Background Beams",
    library: "aceternity",
    description:
      "Animated light beam lines that sweep across the background, creating a dynamic and futuristic look with SVG path animations.",
    whenToUse:
      "Use for hero sections, contact forms, or CTA sections to add visual flair with animated beam effects.",
    installation: "npx aceternity-ui@latest add background-beams",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the beams container",
      },
    ],
    codeExample: `import { BackgroundBeams } from "@/components/ui/background-beams"

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to MailJet, the best transactional email service on the web.
        </p>
        <input
          type="text"
          placeholder="hi@manuarora.in"
          className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-4 bg-neutral-950 placeholder:text-neutral-700"
        />
      </div>
      <BackgroundBeams />
    </div>
  )
}`,
    tags: ["background", "beams", "animation", "light", "hero", "svg"],
  },
  {
    name: "Background Gradient",
    library: "aceternity",
    description:
      "A smooth animated gradient background that cycles through colors with a blur effect, creating an organic flowing color transition.",
    whenToUse:
      "Use as a subtle animated background for sections, cards, or hero areas where you want gentle color movement.",
    installation: "npx aceternity-ui@latest add background-gradient",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the gradient container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the wrapper element",
      },
      {
        name: "animate",
        type: "boolean",
        default: "true",
        description: "Whether the gradient should animate",
      },
    ],
    codeExample: `import { BackgroundGradient } from "@/components/ui/background-gradient"

export function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <img src="/product.png" alt="product" className="object-contain" />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Air Jordan 4 Retro Reimagined
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The Air Jordan 4 Retro Reimagined Bred will release on Saturday.
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>Buy now</span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">$100</span>
        </button>
      </BackgroundGradient>
    </div>
  )
}`,
    tags: ["background", "gradient", "animation", "card", "glow"],
  },
  {
    name: "Background Lines",
    library: "aceternity",
    description:
      "Animated diagonal lines that flow across the background, creating a sleek geometric pattern with smooth motion.",
    whenToUse:
      "Use for hero sections or page backgrounds where you want a clean, modern animated line pattern.",
    installation: "npx aceternity-ui@latest add background-lines",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render on top of the animated lines",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
      {
        name: "svgOptions",
        type: "object",
        default: "{}",
        description: "Options to customize the SVG lines (duration, colors, etc.)",
      },
    ],
    codeExample: `import { BackgroundLines } from "@/components/ui/background-lines"

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Sanjana Airlines, <br /> Redefining Travel.
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Get the best advice from our experts, including expert artists and more.
      </p>
    </BackgroundLines>
  )
}`,
    tags: ["background", "lines", "animation", "geometric", "hero"],
  },
  {
    name: "Bento Grid",
    library: "aceternity",
    description:
      "A responsive bento-box style grid layout with animated items, supporting various sizes and hover effects for showcasing features or content.",
    whenToUse:
      "Use for feature showcases, dashboard layouts, portfolio grids, or any content that benefits from a modern bento-style grid layout.",
    installation: "npx aceternity-ui@latest add bento-grid",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the grid container",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "BentoGridItem components to render in the grid",
      },
    ],
    codeExample: `import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  )
}

const items = [
  { title: "The Dawn of Innovation", description: "Explore the birth of groundbreaking ideas." },
  { title: "The Digital Revolution", description: "Dive into the transformative power of technology." },
]`,
    tags: ["grid", "bento", "layout", "responsive", "features", "showcase"],
  },
  {
    name: "Canvas Reveal Effect",
    library: "aceternity",
    description:
      "An interactive reveal effect where hovering over an element reveals hidden content underneath using a canvas-based circular mask that follows the cursor.",
    whenToUse:
      "Use for interactive reveal experiences, before/after comparisons, hidden content reveals, or creative hover interactions.",
    installation: "npx aceternity-ui@latest add canvas-reveal-effect",
    props: [
      {
        name: "animationSpeed",
        type: "number",
        default: "0.4",
        description: "Speed of the reveal animation",
      },
      {
        name: "opacities",
        type: "number[]",
        default: "[0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]",
        description: "Array of opacity values for the dot matrix",
      },
      {
        name: "colors",
        type: "number[][]",
        default: "[[0, 255, 255]]",
        description: "RGB color arrays for the canvas dots",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the container element",
      },
    ],
    codeExample: `import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"

export function CanvasRevealEffectDemo() {
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto px-8">
      <Card title="Sheetal is Naughty" icon={<AcesIcon />}>
        <CanvasRevealEffect
          animationSpeed={5.1}
          containerClassName="bg-emerald-900"
        />
      </Card>
      <Card title="Manu is Naughty" icon={<AceIcon />}>
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[236, 72, 153], [232, 121, 249]]}
          dotSize={2}
        />
      </Card>
    </div>
  )
}`,
    tags: ["canvas", "reveal", "hover", "interactive", "animation", "mask"],
  },
  {
    name: "Card Hover Effect",
    library: "aceternity",
    description:
      "A collection of cards with smooth hover animations that highlight the active card while dimming others, featuring gradient borders and glowing effects.",
    whenToUse:
      "Use for pricing cards, feature comparisons, team member cards, or any grid of cards where you want an interactive hover spotlight effect.",
    installation: "npx aceternity-ui@latest add card-hover-effect",
    props: [
      {
        name: "items",
        type: "{ title: string; description: string; link: string }[]",
        default: "[]",
        description: "Array of card data objects to render",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card grid",
      },
    ],
    codeExample: `import { HoverEffect } from "@/components/ui/card-hover-effect"

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  )
}

const projects = [
  { title: "Stripe", description: "A payment infrastructure.", link: "https://stripe.com" },
  { title: "Netflix", description: "A streaming service.", link: "https://netflix.com" },
  { title: "Google", description: "A search engine.", link: "https://google.com" },
]`,
    tags: ["card", "hover", "spotlight", "grid", "animation", "glow"],
  },
  {
    name: "Card Stack",
    library: "aceternity",
    description:
      "An animated stack of cards that automatically cycles through content with smooth transitions, showing one card at a time with a stack visual behind it.",
    whenToUse:
      "Use for testimonials, quotes, feature highlights, or any rotating content where you want a stacked card animation.",
    installation: "npx aceternity-ui@latest add card-stack",
    props: [
      {
        name: "items",
        type: "{ id: number; name: string; designation: string; content: React.ReactNode }[]",
        default: "[]",
        description: "Array of card items to display in the stack",
      },
      {
        name: "offset",
        type: "number",
        default: "10",
        description: "Vertical offset between stacked cards in pixels",
      },
      {
        name: "scaleFactor",
        type: "number",
        default: "0.06",
        description: "Scale reduction factor for each subsequent card",
      },
    ],
    codeExample: `import { CardStack } from "@/components/ui/card-stack"

export function CardStackDemo() {
  return (
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  )
}

const CARDS = [
  { id: 0, name: "Manu Arora", designation: "Senior Engineer", content: <p>These cards are amazing!</p> },
  { id: 1, name: "Elon Musk", designation: "Tech Lead", content: <p>I love Aceternity UI.</p> },
]`,
    tags: [
      "card",
      "stack",
      "testimonial",
      "rotation",
      "animation",
      "carousel",
    ],
  },
  {
    name: "Compare",
    library: "aceternity",
    description:
      "A before/after image comparison slider that lets users drag a divider to reveal two overlapping images, with smooth motion and touch support.",
    whenToUse:
      "Use for before/after comparisons, design previews, photo editing showcases, or any scenario requiring side-by-side visual comparison.",
    installation: "npx aceternity-ui@latest add compare",
    props: [
      {
        name: "firstImage",
        type: "string",
        default: "undefined",
        description: "URL of the first (before) image",
      },
      {
        name: "secondImage",
        type: "string",
        default: "undefined",
        description: "URL of the second (after) image",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the compare container",
      },
      {
        name: "slideMode",
        type: '"hover" | "drag"',
        default: '"hover"',
        description: "Whether the slider follows hover position or requires dragging",
      },
    ],
    codeExample: `import { Compare } from "@/components/ui/compare"

export function CompareDemo() {
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage="/before.png"
        secondImage="/after.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  )
}`,
    tags: [
      "compare",
      "before-after",
      "slider",
      "image",
      "interactive",
      "drag",
    ],
  },
  {
    name: "Container Scroll Animation",
    library: "aceternity",
    description:
      "A scroll-triggered animation that reveals content with a 3D perspective rotation as the user scrolls, creating a dramatic unveiling effect.",
    whenToUse:
      "Use for product showcases, app previews, or hero sections where you want content to dramatically rotate into view on scroll.",
    installation: "npx aceternity-ui@latest add container-scroll-animation",
    props: [
      {
        name: "titleComponent",
        type: "React.ReactNode",
        default: "undefined",
        description: "Title content displayed above the scroll animation",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content that animates on scroll (typically an image or card)",
      },
    ],
    codeExample: `import { ContainerScroll } from "@/components/ui/container-scroll-animation"

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img src="/hero.png" alt="hero" className="mx-auto rounded-2xl object-cover h-full object-left-top" />
      </ContainerScroll>
    </div>
  )
}`,
    tags: ["scroll", "animation", "3d", "perspective", "hero", "reveal"],
  },
  {
    name: "Direction Aware Hover",
    library: "aceternity",
    description:
      "A hover effect that detects the direction from which the cursor enters the element and animates an overlay accordingly, creating a natural sliding reveal.",
    whenToUse:
      "Use for image galleries, portfolio grids, or team member cards where you want directional hover reveals.",
    installation: "npx aceternity-ui@latest add direction-aware-hover",
    props: [
      {
        name: "imageUrl",
        type: "string",
        default: "undefined",
        description: "URL of the image to display",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Overlay content that slides in on hover",
      },
      {
        name: "childrenClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the overlay content wrapper",
      },
      {
        name: "imageClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the background image",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
    ],
    codeExample: `import { DirectionAwareHover } from "@/components/ui/direction-aware-hover"

export function DirectionAwareHoverDemo() {
  return (
    <div className="h-[40rem] relative flex items-center justify-center">
      <DirectionAwareHover imageUrl="/photo.jpg">
        <p className="font-bold text-xl">In the mountains</p>
        <p className="font-normal text-sm">$1299 / night</p>
      </DirectionAwareHover>
    </div>
  )
}`,
    tags: ["hover", "direction", "reveal", "gallery", "animation", "overlay"],
  },
  {
    name: "Evervault Card",
    library: "aceternity",
    description:
      "A card with an animated encrypted-text effect where random characters shuffle and resolve on hover, inspired by Evervault's design.",
    whenToUse:
      "Use for security-themed sections, encryption showcases, or any card where you want a mysterious/techy character scramble effect.",
    installation: "npx aceternity-ui@latest add evervault-card",
    props: [
      {
        name: "text",
        type: "string",
        default: "undefined",
        description: "The text to display with the encryption effect",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card",
      },
    ],
    codeExample: `import { EvervaultCard, Icon } from "@/components/ui/evervault-card"

export function EvervaultCardDemo() {
  return (
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
      <EvervaultCard text="hover" />
    </div>
  )
}`,
    tags: ["card", "encryption", "text", "hover", "animation", "security"],
  },
  {
    name: "Floating Dock",
    library: "aceternity",
    description:
      "A macOS-style floating dock component with smooth icon magnification on hover, creating an app-launcher-like navigation bar.",
    whenToUse:
      "Use for navigation bars, toolbars, or action menus where you want a polished dock-style interaction with magnification.",
    installation: "npx aceternity-ui@latest add floating-dock",
    props: [
      {
        name: "items",
        type: "{ title: string; icon: React.ReactNode; href: string }[]",
        default: "[]",
        description: "Array of dock items with title, icon, and link",
      },
      {
        name: "desktopClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the desktop dock variant",
      },
      {
        name: "mobileClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the mobile dock variant",
      },
    ],
    codeExample: `import { FloatingDock } from "@/components/ui/floating-dock"
import { IconHome, IconTerminal2, IconNewSection } from "@tabler/icons-react"

export function FloatingDockDemo() {
  const links = [
    { title: "Home", icon: <IconHome className="h-full w-full" />, href: "#" },
    { title: "Products", icon: <IconTerminal2 className="h-full w-full" />, href: "#" },
    { title: "Components", icon: <IconNewSection className="h-full w-full" />, href: "#" },
  ]
  return (
    <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock items={links} />
    </div>
  )
}`,
    tags: ["dock", "navigation", "magnification", "toolbar", "macos", "animation"],
  },
  {
    name: "Floating Navbar",
    library: "aceternity",
    description:
      "A sticky navigation bar that floats at the top of the viewport with a glassmorphism effect, smoothly appearing/disappearing on scroll.",
    whenToUse:
      "Use as the primary navigation bar for any website that needs a modern, floating nav with scroll-aware visibility.",
    installation: "npx aceternity-ui@latest add floating-navbar",
    props: [
      {
        name: "navItems",
        type: "{ name: string; link: string; icon?: React.ReactNode }[]",
        default: "[]",
        description: "Array of navigation items to display",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the navbar",
      },
    ],
    codeExample: `import { FloatingNav } from "@/components/ui/floating-navbar"
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react"

export function FloatingNavDemo() {
  const navItems = [
    { name: "Home", link: "/", icon: <IconHome className="h-4 w-4" /> },
    { name: "About", link: "/about", icon: <IconUser className="h-4 w-4" /> },
    { name: "Contact", link: "/contact", icon: <IconMessage className="h-4 w-4" /> },
  ]
  return <FloatingNav navItems={navItems} />
}`,
    tags: [
      "navbar",
      "navigation",
      "floating",
      "sticky",
      "glassmorphism",
      "scroll",
    ],
  },
  {
    name: "Focus Cards",
    library: "aceternity",
    description:
      "A gallery of cards where hovering on one card focuses it while blurring the rest, creating an elegant spotlight effect.",
    whenToUse:
      "Use for image galleries, portfolio showcases, or feature highlights where you want to draw attention to a single item on hover.",
    installation: "npx aceternity-ui@latest add focus-cards",
    props: [
      {
        name: "cards",
        type: "{ title: string; src: string }[]",
        default: "[]",
        description: "Array of card objects with title and image source",
      },
    ],
    codeExample: `import { FocusCards } from "@/components/ui/focus-cards"

export function FocusCardsDemo() {
  const cards = [
    { title: "Forest Adventure", src: "/images/forest.jpg" },
    { title: "Valley of life", src: "/images/valley.jpg" },
    { title: "Sala behta dariya", src: "/images/river.jpg" },
    { title: "Camping is for pros", src: "/images/camping.jpg" },
  ]
  return <FocusCards cards={cards} />
}`,
    tags: ["cards", "focus", "gallery", "blur", "hover", "spotlight"],
  },
  {
    name: "Following Pointer",
    library: "aceternity",
    description:
      "A decorative cursor follower that creates a custom pointer element (avatar, emoji, or any content) that follows the mouse within a container.",
    whenToUse:
      "Use for interactive sections, blog cards, or creative layouts where you want a custom cursor/pointer that follows mouse movement.",
    installation: "npx aceternity-ui@latest add following-pointer",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content that the pointer follows within",
      },
      {
        name: "title",
        type: "string | React.ReactNode",
        default: "undefined",
        description: "Content to display in the follower element",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
    ],
    codeExample: `import { FollowerPointerCard } from "@/components/ui/following-pointer"

export function FollowingPointerDemo() {
  return (
    <div className="w-80 mx-auto">
      <FollowerPointerCard title={<TitleComponent title="Blog Author" avatar="/avatar.jpg" />}>
        <div className="relative overflow-hidden h-full rounded-2xl">
          <img src="/blog.jpg" alt="blog thumbnail" className="h-48 w-full object-cover" />
          <div className="p-4">
            <h2 className="font-bold my-4 text-lg text-zinc-700">
              How to make a website
            </h2>
            <p className="text-sm text-zinc-500">
              A practical guide to building modern websites.
            </p>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  )
}`,
    tags: ["cursor", "pointer", "follower", "interactive", "hover", "animation"],
  },
  {
    name: "Glare Card",
    library: "aceternity",
    description:
      "A card component with a glossy glare/shine effect that moves with the cursor, simulating a reflective surface like a holographic card.",
    whenToUse:
      "Use for premium product showcases, membership cards, or featured content where you want a reflective, high-end look.",
    installation: "npx aceternity-ui@latest add glare-card",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the glare card",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card",
      },
    ],
    codeExample: `import { GlareCard } from "@/components/ui/glare-card"

export function GlareCardDemo() {
  return (
    <div className="flex items-center justify-center gap-8">
      <GlareCard className="flex flex-col items-center justify-center">
        <img className="h-full w-full absolute inset-0 object-cover" src="/avatar.jpg" alt="Avatar" />
      </GlareCard>
      <GlareCard className="flex flex-col items-center justify-center p-8">
        <p className="text-white font-bold text-xl mt-4">The Greatest Trick</p>
      </GlareCard>
    </div>
  )
}`,
    tags: ["card", "glare", "shine", "holographic", "hover", "premium"],
  },
  {
    name: "Globe",
    library: "aceternity",
    description:
      "An interactive 3D globe rendered with WebGL/Three.js that can display arcs between locations, with smooth rotation and zoom interactions.",
    whenToUse:
      "Use for showcasing global presence, network connections, international services, or any feature requiring a visual representation of worldwide reach.",
    installation: "npx aceternity-ui@latest add globe",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the globe container",
      },
      {
        name: "config",
        type: "GlobeConfig",
        default: "{}",
        description:
          "Configuration object for globe appearance (colors, arc settings, etc.)",
      },
    ],
    codeExample: `import { World } from "@/components/ui/globe"

export function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
  }
  return (
    <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-white relative w-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
        <World data={sampleArcs} globeConfig={globeConfig} />
      </div>
    </div>
  )
}`,
    tags: ["globe", "3d", "webgl", "map", "world", "interactive"],
  },
  {
    name: "Google Gemini Effect",
    library: "aceternity",
    description:
      "An animated SVG effect inspired by Google's Gemini product, featuring flowing multi-colored lines that respond to scroll position.",
    whenToUse:
      "Use for hero sections or feature introductions where you want a dramatic, flowing line animation tied to scroll progress.",
    installation: "npx aceternity-ui@latest add google-gemini-effect",
    props: [
      {
        name: "pathLengths",
        type: "MotionValue[]",
        default: "undefined",
        description:
          "Framer Motion values controlling the draw progress of each SVG path",
      },
      {
        name: "title",
        type: "string",
        default: "undefined",
        description: "Title text displayed above the effect",
      },
      {
        name: "description",
        type: "string",
        default: "undefined",
        description: "Description text displayed below the title",
      },
    ],
    codeExample: `import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function GoogleGeminiEffectDemo() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  return (
    <div className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip" ref={ref}>
      <GoogleGeminiEffect pathLengths={[pathLengthFirst, pathLengthSecond]} />
    </div>
  )
}`,
    tags: ["animation", "svg", "scroll", "lines", "gemini", "hero"],
  },
  {
    name: "Grid Background",
    library: "aceternity",
    description:
      "Customizable grid and dot pattern backgrounds using CSS, perfect for adding subtle texture to any section with optional radial fade.",
    whenToUse:
      "Use as a background pattern for hero sections, content areas, or any section that needs a subtle grid or dot texture.",
    installation: "npx aceternity-ui@latest add grid-background",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the grid container",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to display on top of the grid background",
      },
    ],
    codeExample: `import { cn } from "@/lib/utils"

export function GridBackgroundDemo() {
  return (
    <div className={cn("h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center")}>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Backgrounds
      </p>
    </div>
  )
}`,
    tags: ["background", "grid", "dots", "pattern", "texture", "subtle"],
  },
  {
    name: "Hero Highlight",
    library: "aceternity",
    description:
      "A text highlight animation component that draws attention to key words or phrases with an animated gradient highlight that appears on scroll or load.",
    whenToUse:
      "Use for hero section headlines where you want to emphasize key words with an animated marker/highlight effect.",
    installation: "npx aceternity-ui@latest add hero-highlight",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render with the highlight container",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the highlight wrapper",
      },
    ],
    codeExample: `import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { motion } from "framer-motion"

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, -5, 0] }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        With insomnia, nothing&apos;s real. Everything is far away. Everything is a{" "}
        <Highlight className="text-black dark:text-white">
          copy, of a copy, of a copy.
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  )
}`,
    tags: ["hero", "highlight", "text", "animation", "emphasis", "heading"],
  },
  {
    name: "Hero Parallax",
    library: "aceternity",
    description:
      "A dramatic hero section with a grid of product images that move at different parallax speeds on scroll, creating depth and visual interest.",
    whenToUse:
      "Use for product showcases, portfolio hero sections, or landing pages where you want a dramatic multi-image parallax scrolling effect.",
    installation: "npx aceternity-ui@latest add hero-parallax",
    props: [
      {
        name: "products",
        type: "{ title: string; link: string; thumbnail: string }[]",
        default: "[]",
        description: "Array of products to display in the parallax grid",
      },
    ],
    codeExample: `import { HeroParallax } from "@/components/ui/hero-parallax"

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />
}

const products = [
  { title: "Moonbeam", link: "https://gomoonbeam.com", thumbnail: "/moonbeam.png" },
  { title: "Cursor", link: "https://cursor.so", thumbnail: "/cursor.png" },
  { title: "Rogue", link: "https://userogue.com", thumbnail: "/rogue.png" },
]`,
    tags: ["hero", "parallax", "scroll", "products", "grid", "animation"],
  },
  {
    name: "Hover Border Gradient",
    library: "aceternity",
    description:
      "A button or container with an animated gradient border that rotates and glows on hover, creating a vibrant edge effect.",
    whenToUse:
      "Use for CTA buttons, feature cards, or any element where you want an animated gradient border that activates on hover.",
    installation: "npx aceternity-ui@latest add hover-border-gradient",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the bordered container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer container",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "CSS classes for the inner content area",
      },
      {
        name: "as",
        type: "React.ElementType",
        default: '"button"',
        description: "The HTML element or React component to render as",
      },
      {
        name: "duration",
        type: "number",
        default: "1",
        description: "Duration of the gradient rotation animation in seconds",
      },
    ],
    codeExample: `import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

export function HoverBorderGradientDemo() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Aceternity UI</span>
      </HoverBorderGradient>
    </div>
  )
}`,
    tags: ["border", "gradient", "hover", "button", "glow", "animation"],
  },
  {
    name: "Infinite Moving Cards",
    library: "aceternity",
    description:
      "An infinitely scrolling horizontal carousel of cards that moves automatically with a seamless loop, ideal for testimonials or logos.",
    whenToUse:
      "Use for testimonials, client logos, partner showcases, or any content that benefits from a continuously scrolling horizontal feed.",
    installation: "npx aceternity-ui@latest add infinite-moving-cards",
    props: [
      {
        name: "items",
        type: "{ quote: string; name: string; title: string }[]",
        default: "[]",
        description: "Array of items to display in the carousel",
      },
      {
        name: "direction",
        type: '"left" | "right"',
        default: '"left"',
        description: "Direction of the scrolling animation",
      },
      {
        name: "speed",
        type: '"fast" | "normal" | "slow"',
        default: '"normal"',
        description: "Speed of the scrolling animation",
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        default: "true",
        description: "Whether to pause the animation on hover",
      },
    ],
    codeExample: `import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  )
}

const testimonials = [
  { quote: "It was the best of times, it was the worst of times.", name: "Charles Dickens", title: "A Tale of Two Cities" },
  { quote: "Call me Ishmael.", name: "Herman Melville", title: "Moby Dick" },
]`,
    tags: [
      "carousel",
      "infinite",
      "scrolling",
      "testimonials",
      "logos",
      "animation",
    ],
  },
  {
    name: "Lamp Effect",
    library: "aceternity",
    description:
      "An elegant lamp/spotlight effect where a cone of light expands from above, illuminating text content with a dramatic reveal animation.",
    whenToUse:
      "Use for hero sections, headlines, or any section where you want a dramatic spotlight/lamp reveal effect on text.",
    installation: "npx aceternity-ui@latest add lamp-effect",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to illuminate with the lamp effect",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the lamp container",
      },
    ],
    codeExample: `import { LampContainer } from "@/components/ui/lamp"
import { motion } from "framer-motion"

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  )
}`,
    tags: ["lamp", "spotlight", "hero", "reveal", "animation", "text"],
  },
  {
    name: "Layout Grid",
    library: "aceternity",
    description:
      "An interactive grid layout where clicking on a card expands it to show detailed content, with smooth Framer Motion animations and a blurred backdrop.",
    whenToUse:
      "Use for portfolio grids, feature showcases, or gallery views where you want cards to expand on click to reveal more detail.",
    installation: "npx aceternity-ui@latest add layout-grid",
    props: [
      {
        name: "cards",
        type: "{ id: number; content: React.ReactNode; className: string; thumbnail: string }[]",
        default: "[]",
        description: "Array of card objects with content and thumbnail",
      },
    ],
    codeExample: `import { LayoutGrid } from "@/components/ui/layout-grid"

export function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  )
}

const cards = [
  {
    id: 1,
    content: <p className="font-bold text-4xl text-white">House in the woods</p>,
    className: "md:col-span-2",
    thumbnail: "/house.jpg",
  },
  {
    id: 2,
    content: <p className="font-bold text-4xl text-white">Rivers are serene</p>,
    className: "col-span-1",
    thumbnail: "/river.jpg",
  },
]`,
    tags: ["grid", "layout", "expandable", "gallery", "interactive", "animation"],
  },
  {
    name: "Macbook Scroll",
    library: "aceternity",
    description:
      "A scroll-driven animation that simulates opening a MacBook lid, revealing screen content as the user scrolls, with realistic 3D perspective transforms.",
    whenToUse:
      "Use for product demos, app showcases, or feature reveals where you want to simulate opening a laptop to reveal your product.",
    installation: "npx aceternity-ui@latest add macbook-scroll",
    props: [
      {
        name: "title",
        type: "React.ReactNode",
        default: "undefined",
        description: "Title content above the MacBook animation",
      },
      {
        name: "badge",
        type: "React.ReactNode",
        default: "undefined",
        description: "Badge element to display next to the title",
      },
      {
        name: "src",
        type: "string",
        default: "undefined",
        description: "Image URL to display on the MacBook screen",
      },
      {
        name: "showGradient",
        type: "boolean",
        default: "true",
        description: "Whether to show gradient overlay on the screen",
      },
    ],
    codeExample: `import { MacbookScroll } from "@/components/ui/macbook-scroll"

export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacbookScroll
        title={<span>This Macbook is built with Tailwind CSS.</span>}
        badge={<img src="/badge.png" className="h-10 w-10 transform rounded-full" alt="badge" />}
        src="/screen.png"
        showGradient={false}
      />
    </div>
  )
}`,
    tags: [
      "macbook",
      "scroll",
      "3d",
      "product",
      "laptop",
      "reveal",
      "animation",
    ],
  },
  {
    name: "Meteor Effect",
    library: "aceternity",
    description:
      "Animated meteors/shooting stars that streak across a card or section, adding a cosmic and dynamic visual effect.",
    whenToUse:
      "Use for feature cards, pricing cards, or hero sections where you want animated shooting star trails in the background.",
    installation: "npx aceternity-ui@latest add meteors",
    props: [
      {
        name: "number",
        type: "number",
        default: "20",
        description: "Number of meteor elements to render",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the meteors container",
      },
    ],
    codeExample: `import { Meteors } from "@/components/ui/meteors"

export function MeteorsDemo() {
  return (
    <div className="w-full relative max-w-xs">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
      <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
        <h1 className="font-bold text-xl text-white mb-4 relative z-50">
          Meteors because they&apos;re cool
        </h1>
        <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
          I don&apos;t know what to write so I&apos;ll just paste something cool here.
        </p>
        <Meteors number={20} />
      </div>
    </div>
  )
}`,
    tags: ["meteors", "shooting-stars", "animation", "background", "cosmic", "particles"],
  },
  {
    name: "Moving Border",
    library: "aceternity",
    description:
      "A button or container with a continuously moving/rotating gradient border, creating a dynamic glowing edge effect using SVG animation.",
    whenToUse:
      "Use for CTA buttons, badges, or featured content borders where you want an animated moving border effect.",
    installation: "npx aceternity-ui@latest add moving-border",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the moving border",
      },
      {
        name: "duration",
        type: "number",
        default: "2000",
        description: "Duration of one complete border rotation in milliseconds",
      },
      {
        name: "borderRadius",
        type: "string",
        default: '"1.75rem"',
        description: "Border radius of the container",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the inner content",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer container",
      },
    ],
    codeExample: `import { Button } from "@/components/ui/moving-border"

export function MovingBorderDemo() {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Borders are cool
      </Button>
    </div>
  )
}`,
    tags: ["border", "moving", "button", "glow", "animation", "svg"],
  },
  {
    name: "Multi Step Loader",
    library: "aceternity",
    description:
      "An animated multi-step loading indicator that sequentially highlights steps with checkmarks, showing progress through a series of operations.",
    whenToUse:
      "Use for loading states, onboarding flows, or multi-step processes where you want to show animated progress through sequential steps.",
    installation: "npx aceternity-ui@latest add multi-step-loader",
    props: [
      {
        name: "loadingStates",
        type: "{ text: string }[]",
        default: "[]",
        description: "Array of loading step descriptions",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Whether the loader is active",
      },
      {
        name: "duration",
        type: "number",
        default: "2000",
        description: "Duration of each step in milliseconds",
      },
      {
        name: "loop",
        type: "boolean",
        default: "true",
        description: "Whether to loop through the steps",
      },
    ],
    codeExample: `import { MultiStepLoader } from "@/components/ui/multi-step-loader"

export function MultiStepLoaderDemo() {
  const loadingStates = [
    { text: "Buying a condo" },
    { text: "Travelling in a flight" },
    { text: "Meeting Tyler Durden" },
    { text: "He makes mass soap" },
  ]
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <MultiStepLoader loadingStates={loadingStates} loading={true} duration={2000} loop={true} />
    </div>
  )
}`,
    tags: ["loader", "progress", "steps", "animation", "loading", "sequential"],
  },
  {
    name: "Parallax Scroll",
    library: "aceternity",
    description:
      "A parallax scrolling section with images arranged in columns that move at different speeds, creating a layered depth effect on scroll.",
    whenToUse:
      "Use for image galleries, portfolio sections, or visual storytelling where you want multi-speed parallax scrolling columns.",
    installation: "npx aceternity-ui@latest add parallax-scroll",
    props: [
      {
        name: "images",
        type: "string[]",
        default: "[]",
        description: "Array of image URLs to display in the parallax columns",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the parallax container",
      },
    ],
    codeExample: `import { ParallaxScroll } from "@/components/ui/parallax-scroll"

export function ParallaxScrollDemo() {
  return <ParallaxScroll images={images} />
}

const images = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
  "/photo4.jpg",
  "/photo5.jpg",
  "/photo6.jpg",
]`,
    tags: ["parallax", "scroll", "gallery", "images", "columns", "animation"],
  },
  {
    name: "Placeholders and Vanish Input",
    library: "aceternity",
    description:
      "An animated input field that cycles through placeholder text with a typing effect, and when submitted, the text vanishes with a particle animation.",
    whenToUse:
      "Use for search bars, contact forms, or hero section inputs where you want animated cycling placeholders and a dramatic submit animation.",
    installation: "npx aceternity-ui@latest add placeholders-and-vanish-input",
    props: [
      {
        name: "placeholders",
        type: "string[]",
        default: "[]",
        description: "Array of placeholder texts to cycle through",
      },
      {
        name: "onChange",
        type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
        default: "undefined",
        description: "Callback fired when the input value changes",
      },
      {
        name: "onSubmit",
        type: "(e: React.FormEvent<HTMLFormElement>) => void",
        default: "undefined",
        description: "Callback fired when the form is submitted",
      },
    ],
    codeExample: `import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble mass models of Fourth Street expenses?",
  ]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
  }
  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Aceternity UI Anything
      </h2>
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
    </div>
  )
}`,
    tags: ["input", "placeholder", "animation", "vanish", "search", "form"],
  },
  {
    name: "Shooting Stars",
    library: "aceternity",
    description:
      "An animated background effect with stars and shooting star trails that create a night sky atmosphere using CSS animations.",
    whenToUse:
      "Use for dark-themed hero sections, testimonial backgrounds, or any section that needs a starry night sky with animated shooting stars.",
    installation: "npx aceternity-ui@latest add shooting-stars",
    props: [
      {
        name: "minSpeed",
        type: "number",
        default: "10",
        description: "Minimum animation speed of shooting stars",
      },
      {
        name: "maxSpeed",
        type: "number",
        default: "30",
        description: "Maximum animation speed of shooting stars",
      },
      {
        name: "minDelay",
        type: "number",
        default: "1200",
        description: "Minimum delay between shooting stars in ms",
      },
      {
        name: "maxDelay",
        type: "number",
        default: "4200",
        description: "Maximum delay between shooting stars in ms",
      },
      {
        name: "starColor",
        type: "string",
        default: '"#9E00FF"',
        description: "Color of the shooting stars",
      },
      {
        name: "trailColor",
        type: "string",
        default: '"#2EB9DF"',
        description: "Color of the star trails",
      },
      {
        name: "starWidth",
        type: "number",
        default: "10",
        description: "Width of the shooting star element",
      },
      {
        name: "starHeight",
        type: "number",
        default: "1",
        description: "Height of the shooting star element",
      },
    ],
    codeExample: `import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

export function ShootingStarsDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Shooting Stars</span>
        <span>And Stars Background</span>
      </h2>
      <ShootingStars />
      <StarsBackground />
    </div>
  )
}`,
    tags: [
      "stars",
      "shooting",
      "night",
      "background",
      "animation",
      "cosmic",
    ],
  },
  {
    name: "Sparkles",
    library: "aceternity",
    description:
      "An animated sparkle/twinkle effect that renders particles around content using a TSParticles-based engine, creating a magical glittering look.",
    whenToUse:
      "Use for highlighting important text, headings, CTAs, or any element that needs a magical sparkle/glitter effect.",
    installation: "npx aceternity-ui@latest add sparkles",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render with sparkles around it",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the sparkles container",
      },
      {
        name: "id",
        type: "string",
        default: '"tsparticlesfullpage"',
        description: "Unique ID for the particles instance",
      },
      {
        name: "background",
        type: "string",
        default: '"transparent"',
        description: "Background color of the particles container",
      },
      {
        name: "particleSize",
        type: "number",
        default: "2",
        description: "Size of each sparkle particle",
      },
      {
        name: "minSize",
        type: "number",
        default: "0.6",
        description: "Minimum particle size",
      },
      {
        name: "maxSize",
        type: "number",
        default: "1.4",
        description: "Maximum particle size",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Movement speed of particles",
      },
      {
        name: "particleColor",
        type: "string",
        default: '"#FFFFFF"',
        description: "Color of the sparkle particles",
      },
      {
        name: "particleDensity",
        type: "number",
        default: "100",
        description: "Number of particles to render",
      },
    ],
    codeExample: `import { SparklesCore } from "@/components/ui/sparkles"

export function SparklesDemo() {
  return (
    <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Aceternity
      </h1>
      <div className="w-[40rem] h-40 relative">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
    </div>
  )
}`,
    tags: ["sparkles", "particles", "glitter", "animation", "magic", "text"],
  },
  {
    name: "Spotlight",
    library: "aceternity",
    description:
      "An animated spotlight effect that casts a beam of light across a dark background, adding drama and visual focus to content sections.",
    whenToUse:
      "Use for hero sections, feature highlights, or any dark-themed section where you want an animated spotlight beam effect.",
    installation: "npx aceternity-ui@latest add spotlight",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the spotlight element",
      },
      {
        name: "fill",
        type: "string",
        default: '"white"',
        description: "Fill color of the spotlight beam",
      },
    ],
    codeExample: `import { Spotlight } from "@/components/ui/spotlight"

export function SpotlightDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Spotlight <br /> is the new trend.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Spotlight effect is a great way to draw attention to a specific part of the page.
        </p>
      </div>
    </div>
  )
}`,
    tags: ["spotlight", "light", "hero", "animation", "beam", "focus"],
  },
  {
    name: "Sticky Scroll Reveal",
    library: "aceternity",
    description:
      "A scroll-driven layout where text content is sticky on one side while images/visuals change on the other side as you scroll through sections.",
    whenToUse:
      "Use for feature showcases, product walkthroughs, or storytelling sections where you want content to stick while visuals change on scroll.",
    installation: "npx aceternity-ui@latest add sticky-scroll-reveal",
    props: [
      {
        name: "content",
        type: "{ title: string; description: string; content?: React.ReactNode }[]",
        default: "[]",
        description: "Array of content sections with title, description, and optional visual content",
      },
      {
        name: "contentClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the content/visual panel",
      },
    ],
    codeExample: `import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"

export function StickyScrollRevealDemo() {
  const content = [
    {
      title: "Collaborative Editing",
      description: "Work together in real time with your team.",
      content: <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">Collaborative Editing</div>,
    },
    {
      title: "Real time changes",
      description: "See changes as they happen. No more refreshing.",
      content: <div className="h-full w-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white">Real time changes</div>,
    },
  ]
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  )
}`,
    tags: ["sticky", "scroll", "reveal", "features", "walkthrough", "animation"],
  },
  {
    name: "SVG Mask Effect",
    library: "aceternity",
    description:
      "An interactive SVG mask that reveals content underneath as the user moves their cursor, creating a flashlight or reveal-through-mask effect.",
    whenToUse:
      "Use for interactive reveals, hidden content, creative hero sections, or any UI that needs a cursor-driven mask/reveal effect.",
    installation: "npx aceternity-ui@latest add svg-mask-effect",
    props: [
      {
        name: "revealText",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content revealed through the mask on hover",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Default visible content (shown without hover)",
      },
      {
        name: "size",
        type: "number",
        default: "10",
        description: "Size of the reveal mask circle",
      },
      {
        name: "revealSize",
        type: "number",
        default: "600",
        description: "Size of the mask when hovering",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
    ],
    codeExample: `import { MaskContainer } from "@/components/ui/svg-mask-effect"

export function SVGMaskEffectDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <p className="max-w-4xl mx-auto text-slate-800 text-center text-4xl font-bold">
            The first rule of Fight Club is you do not talk about Fight Club.
          </p>
        }
        className="h-[40rem] border rounded-md"
      >
        <span className="text-red-500">The first rule of MRR Club</span> is you do not
        talk about MRR Club.
      </MaskContainer>
    </div>
  )
}`,
    tags: ["mask", "svg", "reveal", "cursor", "interactive", "flashlight"],
  },
  {
    name: "Tabs (Animated)",
    library: "aceternity",
    description:
      "Animated tab component with smooth Framer Motion transitions between tab panels, featuring an underline indicator that slides between tabs.",
    whenToUse:
      "Use for tabbed content sections, feature comparisons, or any UI requiring animated tab switching with smooth content transitions.",
    installation: "npx aceternity-ui@latest add tabs",
    props: [
      {
        name: "tabs",
        type: "{ title: string; value: string; content?: React.ReactNode }[]",
        default: "[]",
        description: "Array of tab definitions with title, value, and content",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the tabs container",
      },
      {
        name: "activeTabClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the active tab button",
      },
      {
        name: "tabClassName",
        type: "string",
        default: '""',
        description: "CSS classes for each tab button",
      },
      {
        name: "contentClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the tab content panel",
      },
    ],
    codeExample: `import { Tabs } from "@/components/ui/tabs"

export function TabsDemo() {
  const tabs = [
    { title: "Product", value: "product", content: <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900"><p>Product Tab</p></div> },
    { title: "Services", value: "services", content: <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900"><p>Services Tab</p></div> },
    { title: "Playground", value: "playground", content: <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900"><p>Playground Tab</p></div> },
  ]
  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  )
}`,
    tags: ["tabs", "animation", "navigation", "content", "framer-motion", "switching"],
  },
  {
    name: "Text Generate Effect",
    library: "aceternity",
    description:
      "An animated text reveal effect where words appear one by one with a fade-in and blur animation, creating a typewriter-like generative feel.",
    whenToUse:
      "Use for hero section headlines, AI-generated content displays, or any text that should appear with a word-by-word reveal animation.",
    installation: "npx aceternity-ui@latest add text-generate-effect",
    props: [
      {
        name: "words",
        type: "string",
        default: "undefined",
        description: "The text string to animate word by word",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the text container",
      },
      {
        name: "filter",
        type: "boolean",
        default: "true",
        description: "Whether to apply blur filter during animation",
      },
      {
        name: "duration",
        type: "number",
        default: "0.5",
        description: "Duration of each word's animation in seconds",
      },
    ],
    codeExample: `import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

export function TextGenerateEffectDemo() {
  const words = "Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths."
  return <TextGenerateEffect words={words} />
}`,
    tags: ["text", "generate", "typewriter", "animation", "reveal", "words"],
  },
  {
    name: "Text Reveal Card",
    library: "aceternity",
    description:
      "A card where hovering reveals hidden text underneath through a sliding mask effect, creating a before/after text comparison.",
    whenToUse:
      "Use for creative text reveals, content teases, testimonials with hidden messages, or any interactive text-over-text effect.",
    installation: "npx aceternity-ui@latest add text-reveal-card",
    props: [
      {
        name: "text",
        type: "string",
        default: "undefined",
        description: "The base text displayed on the card",
      },
      {
        name: "revealText",
        type: "string",
        default: "undefined",
        description: "The hidden text revealed on hover",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Additional content to render on the card",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card",
      },
    ],
    codeExample: `import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from "@/components/ui/text-reveal-card"

export function TextRevealCardDemo() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-full">
      <TextRevealCard text="You know the business" revealText="I know the chemistry">
        <TextRevealCardTitle>Sometimes, you just need to see it.</TextRevealCardTitle>
        <TextRevealCardDescription>
          This is a text reveal card. Hover over the card to reveal the hidden text.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  )
}`,
    tags: ["text", "reveal", "card", "hover", "mask", "interactive"],
  },
  {
    name: "Tracing Beam",
    library: "aceternity",
    description:
      "An animated vertical beam/line that traces your scroll progress along the page, with a glowing dot indicator and gradient trail.",
    whenToUse:
      "Use for long-form content like blog posts, timelines, or documentation where you want a visual scroll progress indicator alongside the content.",
    installation: "npx aceternity-ui@latest add tracing-beam",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to display alongside the tracing beam",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the beam container",
      },
    ],
    codeExample: `import { TracingBeam } from "@/components/ui/tracing-beam"

export function TracingBeamDemo() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {content.map((item, index) => (
          <div key={index} className="mb-10">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>
            <p className="text-xl mb-4">{item.title}</p>
            <div className="text-sm prose prose-sm dark:prose-invert">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  )
}`,
    tags: [
      "tracing",
      "beam",
      "scroll",
      "progress",
      "timeline",
      "animation",
    ],
  },
  {
    name: "Typewriter Effect",
    library: "aceternity",
    description:
      "An animated typewriter component that types out text character by character and can cycle through multiple strings with a blinking cursor.",
    whenToUse:
      "Use for hero section subtitles, feature descriptions, or any text that should appear with a typing animation effect.",
    installation: "npx aceternity-ui@latest add typewriter-effect",
    props: [
      {
        name: "words",
        type: "{ text: string; className?: string }[]",
        default: "[]",
        description: "Array of word objects to type out sequentially",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the typewriter container",
      },
      {
        name: "cursorClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the blinking cursor element",
      },
    ],
    codeExample: `import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export function TypewriterEffectDemo() {
  const words = [
    { text: "Build" },
    { text: "awesome" },
    { text: "apps" },
    { text: "with" },
    { text: "Aceternity.", className: "text-blue-500 dark:text-blue-500" },
  ]
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-base mb-10">
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={words} />
    </div>
  )
}`,
    tags: ["typewriter", "text", "typing", "animation", "cursor", "sequential"],
  },
  {
    name: "Vortex",
    library: "aceternity",
    description:
      "A WebGL-powered animated vortex/portal effect that renders a swirling particle system, creating a mesmerizing visual focus point.",
    whenToUse:
      "Use for hero sections, loading states, or visual transitions where you want a dramatic spinning vortex/portal animation.",
    installation: "npx aceternity-ui@latest add vortex",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render above the vortex effect",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the vortex container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer container",
      },
      {
        name: "particleCount",
        type: "number",
        default: "500",
        description: "Number of particles in the vortex",
      },
      {
        name: "rangeY",
        type: "number",
        default: "100",
        description: "Vertical range of particle movement",
      },
      {
        name: "baseSpeed",
        type: "number",
        default: "0",
        description: "Base rotation speed of the vortex",
      },
      {
        name: "rangeSpeed",
        type: "number",
        default: "1.5",
        description: "Random speed variation range",
      },
      {
        name: "baseHue",
        type: "number",
        default: "220",
        description: "Base hue for particle colors (0-360)",
      },
    ],
    codeExample: `import { Vortex } from "@/components/ui/vortex"

export function VortexDemo() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          The hell is this?
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          This is chemical, this is &quot;Aceternity UI&quot;.
        </p>
      </Vortex>
    </div>
  )
}`,
    tags: ["vortex", "portal", "webgl", "particles", "animation", "3d"],
  },
  {
    name: "Wavy Background",
    library: "aceternity",
    description:
      "An animated wavy background effect using CSS/SVG waves that create a flowing ocean-like motion behind content.",
    whenToUse:
      "Use for hero sections, CTA sections, or page backgrounds where you want animated flowing wave patterns.",
    installation: "npx aceternity-ui@latest add wavy-background",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to display above the wavy background",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the container",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer container",
      },
      {
        name: "colors",
        type: "string[]",
        default: '["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]',
        description: "Array of colors for the wave gradient",
      },
      {
        name: "waveWidth",
        type: "number",
        default: "50",
        description: "Width of each wave segment",
      },
      {
        name: "backgroundFill",
        type: "string",
        default: '"black"',
        description: "Background fill color behind the waves",
      },
      {
        name: "blur",
        type: "number",
        default: "10",
        description: "Blur amount applied to the waves",
      },
      {
        name: "speed",
        type: '"slow" | "fast"',
        default: '"fast"',
        description: "Speed of the wave animation",
      },
      {
        name: "waveOpacity",
        type: "number",
        default: "0.5",
        description: "Opacity of the wave elements",
      },
    ],
    codeExample: `import { WavyBackground } from "@/components/ui/wavy-background"

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  )
}`,
    tags: ["background", "waves", "animation", "ocean", "hero", "flowing"],
  },
  {
    name: "Wobble Card",
    library: "aceternity",
    description:
      "A card with a playful wobble/tilt animation on hover, creating a fun bouncy interaction effect using spring physics.",
    whenToUse:
      "Use for feature cards, testimonials, or any card grid where you want a playful, bouncy hover interaction.",
    installation: "npx aceternity-ui@latest add wobble-card",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the wobble card",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the card",
      },
      {
        name: "containerClassName",
        type: "string",
        default: '""',
        description: "CSS classes for the outer container",
      },
    ],
    codeExample: `import { WobbleCard } from "@/components/ui/wobble-card"

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]">
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Gippity AI powers the entire universe
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            With over 100,000 monthly active bot users, Gippity AI is the most popular AI platform.
          </p>
        </div>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-900">
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          No shirt, no shoes, no weapons.
        </h2>
      </WobbleCard>
    </div>
  )
}`,
    tags: ["card", "wobble", "hover", "bounce", "spring", "interactive"],
  },
];

// --- Script Execution ---
const OUTPUT_DIR = join(process.cwd(), "data", "components", "aceternity");

function run() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let count = 0;
  for (const component of components) {
    const fileName =
      component.name
        .toLowerCase()
        .replace(/[()]/g, "")
        .replace(/\s+/g, "-")
        .replace(/\//g, "-") + ".json";
    const filePath = join(OUTPUT_DIR, fileName);
    writeFileSync(filePath, JSON.stringify(component, null, 2) + "\n");
    count++;
  }

  console.log(
    `✓ Generated ${count} Aceternity UI component docs in ${OUTPUT_DIR}`
  );
}

run();
