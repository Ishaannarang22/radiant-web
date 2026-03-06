/**
 * scripts/scrape-magic-ui.ts
 *
 * Generates JSON documentation files for Magic UI components.
 * Each file is stored in data/components/magic-ui/<component>.json
 *
 * Usage: npx tsx scripts/scrape-magic-ui.ts
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
    name: "Animated Beam",
    library: "magic-ui",
    description:
      "An animated beam effect that draws a curved line between two elements, simulating a connection or data flow path with a glowing gradient.",
    whenToUse:
      "Use for architecture diagrams, connection visualizations, or showing data flow between components on a page.",
    installation: "npx magicui-cli@latest add animated-beam",
    props: [
      {
        name: "containerRef",
        type: "React.RefObject<HTMLElement>",
        default: "undefined",
        description: "Ref to the container element that bounds the beam",
      },
      {
        name: "fromRef",
        type: "React.RefObject<HTMLElement>",
        default: "undefined",
        description: "Ref to the source element where the beam starts",
      },
      {
        name: "toRef",
        type: "React.RefObject<HTMLElement>",
        default: "undefined",
        description: "Ref to the target element where the beam ends",
      },
      {
        name: "curvature",
        type: "number",
        default: "0",
        description: "Amount of curve applied to the beam path",
      },
      {
        name: "duration",
        type: "number",
        default: "5",
        description: "Animation duration in seconds",
      },
    ],
    codeExample: `import { AnimatedBeam } from "@/components/ui/animated-beam"
import { useRef } from "react"

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative flex h-[300px] w-full items-center justify-between p-10">
      <div ref={fromRef} className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white">
        A
      </div>
      <div ref={toRef} className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white">
        B
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  )
}`,
    tags: ["beam", "connection", "animation", "flow", "diagram"],
  },
  {
    name: "Animated Grid Pattern",
    library: "magic-ui",
    description:
      "A grid pattern background with animated squares that fade in and out randomly, creating a dynamic and subtle background effect.",
    whenToUse:
      "Use as a background for hero sections, feature sections, or any area that needs a subtle animated grid pattern.",
    installation: "npx magicui-cli@latest add animated-grid-pattern",
    props: [
      {
        name: "width",
        type: "number",
        default: "40",
        description: "Width of each grid cell in pixels",
      },
      {
        name: "height",
        type: "number",
        default: "40",
        description: "Height of each grid cell in pixels",
      },
      {
        name: "numSquares",
        type: "number",
        default: "50",
        description: "Number of animated squares visible at a time",
      },
      {
        name: "maxOpacity",
        type: "number",
        default: "0.5",
        description: "Maximum opacity of the animated squares",
      },
      {
        name: "duration",
        type: "number",
        default: "4",
        description: "Animation duration in seconds for each square",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"

export function AnimatedGridPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20">
      <p className="z-10 text-5xl font-medium tracking-tighter text-black dark:text-white">
        Magic UI
      </p>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn("[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]")}
      />
    </div>
  )
}`,
    tags: ["grid", "pattern", "background", "animation", "subtle"],
  },
  {
    name: "Animated List",
    library: "magic-ui",
    description:
      "A list component with staggered entrance animations, where each item slides in from below with a fade effect in sequence.",
    whenToUse:
      "Use for notification lists, activity feeds, feature lists, or any sequential content that benefits from animated entry.",
    installation: "npx magicui-cli@latest add animated-list",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "List items to animate",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the list container",
      },
      {
        name: "delay",
        type: "number",
        default: "1000",
        description: "Delay in ms between each item's animation",
      },
    ],
    codeExample: `import { AnimatedList } from "@/components/ui/animated-list"

const notifications = [
  { name: "Payment received", description: "Magic UI - $2,000.00", time: "15m ago", icon: "💸" },
  { name: "User signed up", description: "john@example.com", time: "10m ago", icon: "👤" },
  { name: "New message", description: "How's the project?", time: "5m ago", icon: "💬" },
]

export function AnimatedListDemo() {
  return (
    <div className="relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg border bg-background p-6">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <p className="ml-auto text-xs text-muted-foreground">{item.time}</p>
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}`,
    tags: ["list", "animation", "stagger", "notification", "feed"],
  },
  {
    name: "Animated Shiny Text",
    library: "magic-ui",
    description:
      "A text component with a shimmering shine animation that sweeps across the text, creating a metallic or glossy highlight effect.",
    whenToUse:
      "Use for badges, announcements, CTAs, or any text element that should draw attention with a shine effect.",
    installation: "npx magicui-cli@latest add animated-shiny-text",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Text content to apply the shine effect to",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "shimmerWidth",
        type: "number",
        default: "100",
        description: "Width of the shimmer effect in pixels",
      },
    ],
    codeExample: `import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export function AnimatedShinyTextDemo() {
  return (
    <div className="z-10 flex items-center justify-center">
      <div className={cn("group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800")}>
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>Introducing Magic UI</span>
          <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  )
}`,
    tags: ["text", "shine", "shimmer", "animation", "badge", "cta"],
  },
  {
    name: "Animated Subscribe Button",
    library: "magic-ui",
    description:
      "A subscribe button with an animated state transition that morphs between 'Subscribe' and 'Subscribed' states with a smooth animation.",
    whenToUse:
      "Use for newsletter signups, subscription forms, or any toggle action that benefits from satisfying animated feedback.",
    installation: "npx magicui-cli@latest add animated-subscribe-button",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Two children: initial state and subscribed state content",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the button",
      },
      {
        name: "subscribeStatus",
        type: "boolean",
        default: "false",
        description: "Current subscription state",
      },
      {
        name: "onClick",
        type: "() => void",
        default: "undefined",
        description: "Click handler for the button",
      },
    ],
    codeExample: `import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

export function AnimatedSubscribeButtonDemo() {
  return (
    <AnimatedSubscribeButton className="w-36">
      <span className="group inline-flex items-center">
        Subscribe
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Subscribed
      </span>
    </AnimatedSubscribeButton>
  )
}`,
    tags: ["button", "subscribe", "animation", "toggle", "interactive"],
  },
  {
    name: "Bento Grid",
    library: "magic-ui",
    description:
      "A flexible bento-style grid layout component for showcasing features or content in asymmetric, visually appealing grid cards.",
    whenToUse:
      "Use for feature sections, product showcases, or dashboard-style layouts where content cards need varied sizes and positions.",
    installation: "npx magicui-cli@latest add bento-grid",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Grid items to render",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the grid container",
      },
    ],
    codeExample: `import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"

const features = [
  { name: "Feature 1", description: "Description here", className: "col-span-3 lg:col-span-1" },
  { name: "Feature 2", description: "Description here", className: "col-span-3 lg:col-span-2" },
  { name: "Feature 3", description: "Description here", className: "col-span-3 lg:col-span-2" },
  { name: "Feature 4", description: "Description here", className: "col-span-3 lg:col-span-1" },
]

export function BentoGridDemo() {
  return (
    <BentoGrid>
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}`,
    tags: ["grid", "bento", "layout", "cards", "features", "dashboard"],
  },
  {
    name: "BlurFade",
    library: "magic-ui",
    description:
      "An entrance animation component that fades in content with a simultaneous blur-to-clear transition, creating an elegant reveal effect.",
    whenToUse:
      "Use for page entrance animations, section reveals on scroll, or any content that should appear with a smooth blur-to-focus transition.",
    installation: "npx magicui-cli@latest add blur-fade",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to animate",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "delay",
        type: "number",
        default: "0.25",
        description: "Delay before animation starts in seconds",
      },
      {
        name: "inView",
        type: "boolean",
        default: "true",
        description: "Whether to trigger animation when in viewport",
      },
      {
        name: "blur",
        type: "string",
        default: '"6px"',
        description: "Initial blur amount",
      },
    ],
    codeExample: `import { BlurFade } from "@/components/ui/blur-fade"

export function BlurFadeDemo() {
  return (
    <div className="flex flex-col gap-4">
      {["First item", "Second item", "Third item"].map((text, idx) => (
        <BlurFade key={text} delay={0.25 + idx * 0.05} inView>
          <p className="text-lg font-medium">{text}</p>
        </BlurFade>
      ))}
    </div>
  )
}`,
    tags: ["blur", "fade", "entrance", "animation", "reveal", "scroll"],
  },
  {
    name: "Border Beam",
    library: "magic-ui",
    description:
      "An animated border effect where a glowing beam travels along the border of an element, creating a dynamic highlight that traces the perimeter.",
    whenToUse:
      "Use for highlighting cards, feature boxes, pricing tiers, or any container that needs an eye-catching animated border.",
    installation: "npx magicui-cli@latest add border-beam",
    props: [
      {
        name: "size",
        type: "number",
        default: "200",
        description: "Size of the beam highlight in pixels",
      },
      {
        name: "duration",
        type: "number",
        default: "15",
        description: "Time in seconds for one full border loop",
      },
      {
        name: "borderWidth",
        type: "number",
        default: "1.5",
        description: "Width of the border in pixels",
      },
      {
        name: "colorFrom",
        type: "string",
        default: '"#ffaa40"',
        description: "Starting gradient color of the beam",
      },
      {
        name: "colorTo",
        type: "string",
        default: '"#9c40ff"',
        description: "Ending gradient color of the beam",
      },
    ],
    codeExample: `import { BorderBeam } from "@/components/ui/border-beam"

export function BorderBeamDemo() {
  return (
    <div className="relative flex h-[200px] w-[300px] flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Border Beam
      </span>
      <BorderBeam size={250} duration={12} delay={9} />
    </div>
  )
}`,
    tags: ["border", "beam", "glow", "animation", "highlight", "gradient"],
  },
  {
    name: "Confetti",
    library: "magic-ui",
    description:
      "A confetti animation component that shoots colorful confetti particles, perfect for celebrating user actions like completing a purchase or achieving a milestone.",
    whenToUse:
      "Use for celebration moments, successful form submissions, purchase confirmations, or gamification milestones.",
    installation: "npx magicui-cli@latest add confetti",
    props: [
      {
        name: "options",
        type: "ConfettiOptions",
        default: "{}",
        description: "Configuration options for the confetti burst (particleCount, spread, etc.)",
      },
      {
        name: "manualstart",
        type: "boolean",
        default: "false",
        description: "If true, confetti will not fire automatically",
      },
    ],
    codeExample: `import { Confetti } from "@/components/ui/confetti"

export function ConfettiDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <button
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        onClick={() => {
          Confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }}
      >
        Celebrate!
      </button>
      <Confetti />
    </div>
  )
}`,
    tags: ["confetti", "celebration", "particles", "animation", "interactive"],
  },
  {
    name: "Cool Mode",
    library: "magic-ui",
    description:
      "A wrapper component that adds particle burst animations on click to any child element, creating playful interactive feedback with customizable emojis or shapes.",
    whenToUse:
      "Use for adding fun interactive feedback to buttons, likes, or any clickable element where playful particles enhance the experience.",
    installation: "npx magicui-cli@latest add cool-mode",
    props: [
      {
        name: "children",
        type: "React.ReactElement",
        default: "undefined",
        description: "The clickable element to wrap",
      },
      {
        name: "options",
        type: "CoolModeOptions",
        default: "{}",
        description: "Configuration for particle type, size, speed, and count",
      },
    ],
    codeExample: `import { CoolMode } from "@/components/ui/cool-mode"

export function CoolModeDemo() {
  return (
    <div className="relative flex items-center justify-center">
      <CoolMode>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Click Me!
        </button>
      </CoolMode>
    </div>
  )
}`,
    tags: ["particles", "click", "interactive", "fun", "animation"],
  },
  {
    name: "Dock",
    library: "magic-ui",
    description:
      "A macOS-style dock component with magnification effect on hover, where icons scale up as the cursor approaches them.",
    whenToUse:
      "Use for navigation bars, tool palettes, or social link sections where a macOS dock-style interaction enhances the UX.",
    installation: "npx magicui-cli@latest add dock",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Dock items to render",
      },
      {
        name: "magnification",
        type: "number",
        default: "60",
        description: "Maximum icon size in pixels when magnified",
      },
      {
        name: "distance",
        type: "number",
        default: "140",
        description: "Distance in pixels at which magnification starts",
      },
      {
        name: "direction",
        type: '"top" | "middle" | "bottom"',
        default: '"bottom"',
        description: "Direction of the magnification growth",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { Dock, DockIcon } from "@/components/ui/dock"
import { Home, Mail, Settings, User } from "lucide-react"

export function DockDemo() {
  return (
    <div className="relative flex w-full items-center justify-center">
      <Dock magnification={60} distance={100}>
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <Home className="size-full" />
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <User className="size-full" />
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <Mail className="size-full" />
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
          <Settings className="size-full" />
        </DockIcon>
      </Dock>
    </div>
  )
}`,
    tags: ["dock", "navigation", "magnification", "hover", "interactive", "macos"],
  },
  {
    name: "Dot Pattern",
    library: "magic-ui",
    description:
      "A repeating dot pattern background using SVG, creating a clean and minimal dotted backdrop for content sections.",
    whenToUse:
      "Use as a background for hero sections, content areas, or cards where a subtle dotted pattern adds visual texture.",
    installation: "npx magicui-cli@latest add dot-pattern",
    props: [
      {
        name: "width",
        type: "number",
        default: "16",
        description: "Horizontal spacing between dots",
      },
      {
        name: "height",
        type: "number",
        default: "16",
        description: "Vertical spacing between dots",
      },
      {
        name: "cx",
        type: "number",
        default: "1",
        description: "X position of dot within the pattern cell",
      },
      {
        name: "cy",
        type: "number",
        default: "1",
        description: "Y position of dot within the pattern cell",
      },
      {
        name: "cr",
        type: "number",
        default: "1",
        description: "Radius of each dot",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

export function DotPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Dot Pattern
      </p>
      <DotPattern className={cn("[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]")} />
    </div>
  )
}`,
    tags: ["dots", "pattern", "background", "subtle", "texture"],
  },
  {
    name: "Fade Text",
    library: "magic-ui",
    description:
      "A text animation component that fades in each word sequentially with a slight upward motion, creating an elegant word-by-word reveal.",
    whenToUse:
      "Use for hero headlines, section titles, or any text that should appear with a dramatic word-by-word fade-in animation.",
    installation: "npx magicui-cli@latest add fade-text",
    props: [
      {
        name: "text",
        type: "string",
        default: '""',
        description: "The text content to animate word by word",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "direction",
        type: '"up" | "down"',
        default: '"up"',
        description: "Direction of the fade animation",
      },
      {
        name: "framerProps",
        type: "MotionProps",
        default: "{}",
        description: "Custom framer-motion animation properties",
      },
    ],
    codeExample: `import { FadeText } from "@/components/ui/fade-text"

export function FadeTextDemo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <FadeText
        text="Welcome to Magic UI"
        className="text-4xl font-bold text-black dark:text-white"
        direction="up"
      />
    </div>
  )
}`,
    tags: ["text", "fade", "animation", "reveal", "hero", "headline"],
  },
  {
    name: "Globe",
    library: "magic-ui",
    description:
      "An interactive 3D globe component rendered with WebGL/Three.js, displaying connection arcs between locations on a rotating Earth.",
    whenToUse:
      "Use for showcasing global presence, international customers, CDN coverage, or any feature that benefits from a geographic visualization.",
    installation: "npx magicui-cli@latest add globe",
    props: [
      {
        name: "config",
        type: "COBEOptions",
        default: "{}",
        description: "Configuration object for the COBE globe renderer",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the canvas container",
      },
    ],
    codeExample: `import { Globe } from "@/components/ui/globe"

export function GlobeDemo() {
  return (
    <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Globe
      </span>
      <Globe className="top-28" />
    </div>
  )
}`,
    tags: ["globe", "3d", "map", "interactive", "webgl", "geographic"],
  },
  {
    name: "Grid Pattern",
    library: "magic-ui",
    description:
      "A clean SVG-based grid pattern background component that creates a subtle lined grid effect, perfect for minimal design backgrounds.",
    whenToUse:
      "Use as a background for hero sections, code editors, or technical-looking interfaces that benefit from a grid aesthetic.",
    installation: "npx magicui-cli@latest add grid-pattern",
    props: [
      {
        name: "width",
        type: "number",
        default: "40",
        description: "Width of each grid cell",
      },
      {
        name: "height",
        type: "number",
        default: "40",
        description: "Height of each grid cell",
      },
      {
        name: "strokeDasharray",
        type: "string",
        default: '"0"',
        description: "SVG stroke-dasharray for dashed grid lines",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

export function GridPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Grid Pattern
      </p>
      <GridPattern
        width={30}
        height={30}
        className={cn("[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]")}
      />
    </div>
  )
}`,
    tags: ["grid", "pattern", "background", "lines", "minimal"],
  },
  {
    name: "Hyper Text",
    library: "magic-ui",
    description:
      "A text animation where characters scramble through random letters before resolving to the final text, creating a hacker/decryption-style reveal effect.",
    whenToUse:
      "Use for hero text, loading states, or any element where a scrambling text reveal creates intrigue and visual interest.",
    installation: "npx magicui-cli@latest add hyper-text",
    props: [
      {
        name: "text",
        type: "string",
        default: '""',
        description: "The final text to display after scramble animation",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "duration",
        type: "number",
        default: "800",
        description: "Duration of the scramble animation in milliseconds",
      },
      {
        name: "animateOnLoad",
        type: "boolean",
        default: "true",
        description: "Whether to play the animation on mount",
      },
    ],
    codeExample: `import { HyperText } from "@/components/ui/hyper-text"

export function HyperTextDemo() {
  return (
    <HyperText
      text="Hyper Text"
      className="text-4xl font-bold text-black dark:text-white"
      duration={800}
    />
  )
}`,
    tags: ["text", "scramble", "hacker", "animation", "reveal"],
  },
  {
    name: "Icon Cloud",
    library: "magic-ui",
    description:
      "A 3D rotating cloud of icons/logos rendered in a sphere formation, similar to a tag cloud but with smooth WebGL-powered rotation.",
    whenToUse:
      "Use for technology stack showcases, partner logos, skill displays, or any collection of icons that benefits from a 3D cloud visualization.",
    installation: "npx magicui-cli@latest add icon-cloud",
    props: [
      {
        name: "iconSlugs",
        type: "string[]",
        default: "[]",
        description: "Array of Simple Icons slugs to display in the cloud",
      },
      {
        name: "images",
        type: "string[]",
        default: "[]",
        description: "Array of image URLs to use as icons",
      },
    ],
    codeExample: `import { IconCloud } from "@/components/ui/icon-cloud"

const slugs = [
  "typescript", "javascript", "react", "nextdotjs", "prisma",
  "postgresql", "vercel", "docker", "git", "github",
  "tailwindcss", "figma", "nodejs", "python",
]

export function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8">
      <IconCloud iconSlugs={slugs} />
    </div>
  )
}`,
    tags: ["icons", "cloud", "3d", "logos", "tech-stack", "interactive"],
  },
  {
    name: "Marquee",
    library: "magic-ui",
    description:
      "An infinite scrolling marquee component that smoothly loops content horizontally or vertically, perfect for testimonials, logos, or any repeating content.",
    whenToUse:
      "Use for client logos, testimonial carousels, partner lists, or any content that should scroll continuously in a loop.",
    installation: "npx magicui-cli@latest add marquee",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content items to scroll in the marquee",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "reverse",
        type: "boolean",
        default: "false",
        description: "Reverse the scroll direction",
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        default: "false",
        description: "Pause the animation on mouse hover",
      },
      {
        name: "vertical",
        type: "boolean",
        default: "false",
        description: "Scroll vertically instead of horizontally",
      },
      {
        name: "repeat",
        type: "number",
        default: "4",
        description: "Number of content repetitions for seamless loop",
      },
    ],
    codeExample: `import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

const reviews = [
  { name: "Jack", body: "This is amazing!", img: "/avatar1.png" },
  { name: "Jill", body: "I love this so much!", img: "/avatar2.png" },
  { name: "John", body: "Incredible work!", img: "/avatar3.png" },
]

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review) => (
          <figure key={review.name} className={cn("relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4")}>
            <div className="flex flex-row items-center gap-2">
              <img className="rounded-full" width="32" height="32" alt="" src={review.img} />
              <figcaption className="text-sm font-medium dark:text-white">{review.name}</figcaption>
            </div>
            <blockquote className="mt-2 text-sm">{review.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    </div>
  )
}`,
    tags: ["marquee", "scroll", "infinite", "carousel", "logos", "testimonials"],
  },
  {
    name: "Meteors",
    library: "magic-ui",
    description:
      "An animated meteor shower effect with glowing trails that streak across the component, creating a cosmic/space-themed visual effect.",
    whenToUse:
      "Use for hero sections, feature cards, or backgrounds where a cosmic/space meteor effect adds visual drama.",
    installation: "npx magicui-cli@latest add meteors",
    props: [
      {
        name: "number",
        type: "number",
        default: "20",
        description: "Number of meteor particles",
      },
    ],
    codeExample: `import { Meteors } from "@/components/ui/meteors"

export function MeteorsDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <Meteors number={30} />
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Meteors
      </span>
    </div>
  )
}`,
    tags: ["meteors", "space", "particles", "animation", "background", "cosmic"],
  },
  {
    name: "Number Ticker",
    library: "magic-ui",
    description:
      "An animated number counter that ticks up from zero to a target value with a smooth rolling digit animation, perfect for statistics and metrics.",
    whenToUse:
      "Use for statistics sections, dashboards, pricing numbers, or any numeric value that should animate into view to draw attention.",
    installation: "npx magicui-cli@latest add number-ticker",
    props: [
      {
        name: "value",
        type: "number",
        default: "0",
        description: "The target number to animate to",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Delay before animation starts in seconds",
      },
      {
        name: "decimalPlaces",
        type: "number",
        default: "0",
        description: "Number of decimal places to show",
      },
      {
        name: "direction",
        type: '"up" | "down"',
        default: '"up"',
        description: "Direction of the counting animation",
      },
    ],
    codeExample: `import { NumberTicker } from "@/components/ui/number-ticker"

export function NumberTickerDemo() {
  return (
    <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white">
      <NumberTicker value={9800} />
    </p>
  )
}`,
    tags: ["number", "counter", "ticker", "animation", "statistics", "metrics"],
  },
  {
    name: "Particles",
    library: "magic-ui",
    description:
      "A full-screen particle animation background using HTML Canvas, with particles that float, connect, and respond to mouse proximity.",
    whenToUse:
      "Use for hero section backgrounds, landing pages, or tech-focused designs where floating connected particles add ambiance.",
    installation: "npx magicui-cli@latest add particles",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes for the canvas container",
      },
      {
        name: "quantity",
        type: "number",
        default: "100",
        description: "Number of particles",
      },
      {
        name: "color",
        type: "string",
        default: '"#ffffff"',
        description: "Color of the particles",
      },
      {
        name: "refresh",
        type: "boolean",
        default: "false",
        description: "Trigger re-initialization of particles",
      },
    ],
    codeExample: `import { Particles } from "@/components/ui/particles"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ParticlesDemo() {
  const { resolvedTheme } = useTheme()
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none text-center text-8xl font-semibold text-black dark:text-white">
        Particles
      </span>
      <Particles className="absolute inset-0" quantity={100} color={color} refresh />
    </div>
  )
}`,
    tags: ["particles", "background", "canvas", "floating", "interactive"],
  },
  {
    name: "Pulsating Button",
    library: "magic-ui",
    description:
      "A button component with a continuous pulsating glow animation that draws attention, using a radiating ring effect around the button.",
    whenToUse:
      "Use for primary CTAs, important action buttons, or any button that needs maximum visibility and attention-grabbing animation.",
    installation: "npx magicui-cli@latest add pulsating-button",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Button content",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "pulseColor",
        type: "string",
        default: '"#0096ff"',
        description: "Color of the pulsating ring",
      },
      {
        name: "duration",
        type: "string",
        default: '"1.5s"',
        description: "Duration of one pulse cycle",
      },
    ],
    codeExample: `import { PulsatingButton } from "@/components/ui/pulsating-button"

export function PulsatingButtonDemo() {
  return (
    <PulsatingButton>Get Started</PulsatingButton>
  )
}`,
    tags: ["button", "pulse", "cta", "animation", "glow", "attention"],
  },
  {
    name: "Retro Grid",
    library: "magic-ui",
    description:
      "A retro-style perspective grid background that creates a vaporwave/synthwave aesthetic with a vanishing point grid receding into the distance.",
    whenToUse:
      "Use for hero sections, landing pages, or any section where a retro/synthwave aesthetic with a perspective grid adds visual character.",
    installation: "npx magicui-cli@latest add retro-grid",
    props: [
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "angle",
        type: "number",
        default: "65",
        description: "Perspective angle of the grid in degrees",
      },
    ],
    codeExample: `import { RetroGrid } from "@/components/ui/retro-grid"

export function RetroGridDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Retro Grid
      </span>
      <RetroGrid />
    </div>
  )
}`,
    tags: ["retro", "grid", "background", "synthwave", "vaporwave", "perspective"],
  },
  {
    name: "Ripple",
    library: "magic-ui",
    description:
      "Concentric circle ripple animation expanding outward from a center point, creating a sonar/radar-like pulsing effect.",
    whenToUse:
      "Use for loading indicators, attention-drawing backgrounds, or any element that benefits from a radiating ripple animation.",
    installation: "npx magicui-cli@latest add ripple",
    props: [
      {
        name: "mainCircleSize",
        type: "number",
        default: "210",
        description: "Size of the central circle in pixels",
      },
      {
        name: "mainCircleOpacity",
        type: "number",
        default: "0.24",
        description: "Opacity of the main circle",
      },
      {
        name: "numCircles",
        type: "number",
        default: "8",
        description: "Number of ripple circles",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import { Ripple } from "@/components/ui/ripple"

export function RippleDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        Ripple
      </p>
      <Ripple />
    </div>
  )
}`,
    tags: ["ripple", "pulse", "animation", "background", "sonar", "radar"],
  },
  {
    name: "Safari",
    library: "magic-ui",
    description:
      "A Safari browser mockup component that wraps content in a realistic browser chrome, complete with address bar, navigation buttons, and window controls.",
    whenToUse:
      "Use for product screenshots, app previews, website showcases, or any demo content that looks better framed in a browser window.",
    installation: "npx magicui-cli@latest add safari",
    props: [
      {
        name: "url",
        type: "string",
        default: '"magicui.design"',
        description: "URL displayed in the browser address bar",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "src",
        type: "string",
        default: '""',
        description: "Image source URL for the browser content",
      },
    ],
    codeExample: `import { Safari } from "@/components/ui/safari"

export function SafariDemo() {
  return (
    <div className="relative">
      <Safari url="magicui.design" className="size-full" src="/screenshot.png" />
    </div>
  )
}`,
    tags: ["browser", "mockup", "safari", "preview", "screenshot", "frame"],
  },
  {
    name: "Shimmer Button",
    library: "magic-ui",
    description:
      "A button with a continuous shimmer/shine animation that sweeps across its surface, creating an eye-catching metallic sheen effect.",
    whenToUse:
      "Use for primary CTA buttons, landing page actions, or any button that needs a premium shimmer effect to draw clicks.",
    installation: "npx magicui-cli@latest add shimmer-button",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Button content",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "shimmerColor",
        type: "string",
        default: '"#ffffff"',
        description: "Color of the shimmer sweep",
      },
      {
        name: "shimmerSize",
        type: "string",
        default: '"0.05em"',
        description: "Size of the shimmer effect",
      },
      {
        name: "background",
        type: "string",
        default: '"rgba(0,0,0,1)"',
        description: "Background color of the button",
      },
    ],
    codeExample: `import { ShimmerButton } from "@/components/ui/shimmer-button"

export function ShimmerButtonDemo() {
  return (
    <div className="z-10 flex items-center justify-center">
      <ShimmerButton className="shadow-2xl">
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Shimmer Button
        </span>
      </ShimmerButton>
    </div>
  )
}`,
    tags: ["button", "shimmer", "shine", "cta", "animation", "premium"],
  },
  {
    name: "Shine Border",
    library: "magic-ui",
    description:
      "A container component with an animated rotating gradient border that creates a continuous shining/glowing border effect.",
    whenToUse:
      "Use for highlighting premium content, featured cards, special offers, or any container that needs an animated glowing border.",
    installation: "npx magicui-cli@latest add shine-border",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        default: "undefined",
        description: "Content to render inside the bordered container",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "color",
        type: "string | string[]",
        default: '"#000000"',
        description: "Border gradient color(s)",
      },
      {
        name: "borderWidth",
        type: "number",
        default: "1",
        description: "Width of the animated border",
      },
      {
        name: "duration",
        type: "number",
        default: "14",
        description: "Animation duration in seconds",
      },
    ],
    codeExample: `import { ShineBorder } from "@/components/ui/shine-border"

export function ShineBorderDemo() {
  return (
    <ShineBorder
      className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Shine Border
      </span>
    </ShineBorder>
  )
}`,
    tags: ["border", "shine", "glow", "gradient", "animation", "premium"],
  },
  {
    name: "Sparkles Text",
    library: "magic-ui",
    description:
      "A text component with animated sparkle/star particles floating around and above the text, creating a magical twinkling effect.",
    whenToUse:
      "Use for highlighting special text, promotional headings, awards, or any text that should feel magical and sparkly.",
    installation: "npx magicui-cli@latest add sparkles-text",
    props: [
      {
        name: "text",
        type: "string",
        default: '""',
        description: "The text content to display with sparkles",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "colors",
        type: "{ first: string; second: string }",
        default: '{ first: "#9E7AFF", second: "#FE8BBB" }',
        description: "Colors for the sparkle particles",
      },
      {
        name: "sparklesCount",
        type: "number",
        default: "10",
        description: "Number of sparkle particles",
      },
    ],
    codeExample: `import { SparklesText } from "@/components/ui/sparkles-text"

export function SparklesTextDemo() {
  return (
    <SparklesText text="Magic UI" />
  )
}`,
    tags: ["sparkles", "text", "magic", "animation", "particles", "hero"],
  },
  {
    name: "Typing Animation",
    library: "magic-ui",
    description:
      "A typewriter-style text animation that types out text character by character with a blinking cursor, simulating real-time typing.",
    whenToUse:
      "Use for hero headlines, chat interfaces, terminal effects, or any text that should appear as if being typed in real time.",
    installation: "npx magicui-cli@latest add typing-animation",
    props: [
      {
        name: "text",
        type: "string",
        default: '""',
        description: "The text to type out character by character",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "duration",
        type: "number",
        default: "200",
        description: "Duration between each character in milliseconds",
      },
    ],
    codeExample: `import { TypingAnimation } from "@/components/ui/typing-animation"

export function TypingAnimationDemo() {
  return (
    <TypingAnimation
      text="Typing Animation"
      className="text-4xl font-bold text-black dark:text-white"
      duration={150}
    />
  )
}`,
    tags: ["typing", "typewriter", "text", "animation", "cursor", "terminal"],
  },
  {
    name: "Word Pull Up",
    library: "magic-ui",
    description:
      "A text animation where each word pulls up from below with a spring-like bounce effect, creating an energetic entrance animation.",
    whenToUse:
      "Use for hero headlines, section titles, or any text that should animate in with a dynamic upward pull motion.",
    installation: "npx magicui-cli@latest add word-pull-up",
    props: [
      {
        name: "words",
        type: "string",
        default: '""',
        description: "The text content to animate word by word",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "wrapperFramerProps",
        type: "MotionProps",
        default: "{}",
        description: "Framer motion props for the wrapper element",
      },
      {
        name: "framerProps",
        type: "MotionProps",
        default: "{}",
        description: "Framer motion props for each word",
      },
    ],
    codeExample: `import { WordPullUp } from "@/components/ui/word-pull-up"

export function WordPullUpDemo() {
  return (
    <WordPullUp
      words="Word Pull Up Animation"
      className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
    />
  )
}`,
    tags: ["text", "animation", "pull", "entrance", "hero", "headline"],
  },
  {
    name: "Word Rotate",
    library: "magic-ui",
    description:
      "A text component that rotates through a list of words with a smooth vertical transition, perfect for cycling through features or descriptors.",
    whenToUse:
      "Use for hero sections with rotating descriptors, feature highlights, or anywhere you want to cycle through multiple words/phrases.",
    installation: "npx magicui-cli@latest add word-rotate",
    props: [
      {
        name: "words",
        type: "string[]",
        default: "[]",
        description: "Array of words to rotate through",
      },
      {
        name: "className",
        type: "string",
        default: '""',
        description: "Additional CSS classes",
      },
      {
        name: "duration",
        type: "number",
        default: "2500",
        description: "Duration each word is shown in milliseconds",
      },
      {
        name: "framerProps",
        type: "MotionProps",
        default: "{}",
        description: "Custom framer-motion animation properties",
      },
    ],
    codeExample: `import { WordRotate } from "@/components/ui/word-rotate"

export function WordRotateDemo() {
  return (
    <WordRotate
      className="text-4xl font-bold text-black dark:text-white"
      words={["Web", "Mobile", "Desktop"]}
    />
  )
}`,
    tags: ["text", "rotate", "cycle", "animation", "hero", "dynamic"],
  },
];

// --- Script Execution ---
const OUTPUT_DIR = join(process.cwd(), "data", "components", "magic-ui");

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
    `Generated ${count} Magic UI component docs in ${OUTPUT_DIR}`
  );
}

run();
