/**
 * scripts/scrape-shadcn.ts
 *
 * Generates JSON documentation files for all shadcn/ui components.
 * Each file is stored in data/components/shadcn/<component>.json
 *
 * Usage: npx tsx scripts/scrape-shadcn.ts
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
    name: "Accordion",
    library: "shadcn",
    description:
      "A vertically stacked set of interactive headings that each reveal a section of content.",
    whenToUse:
      "Use for FAQ sections, collapsible content panels, and organizing long content into expandable sections.",
    installation: "npx shadcn@latest add accordion",
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        default: '"single"',
        description: "Whether one or multiple items can be opened at once",
      },
      {
        name: "collapsible",
        type: "boolean",
        default: "false",
        description:
          "When type is single, allows closing all items by clicking the open item",
      },
      {
        name: "defaultValue",
        type: "string | string[]",
        default: "undefined",
        description: "The default open item(s)",
      },
    ],
    codeExample: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match your theme.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
    tags: ["disclosure", "faq", "collapsible", "content"],
  },
  {
    name: "Alert",
    library: "shadcn",
    description:
      "Displays a callout for important information, feedback messages, or warnings.",
    whenToUse:
      "Use for status messages, warnings, errors, success confirmations, and informational callouts.",
    installation: "npx shadcn@latest add alert",
    props: [
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "The visual style of the alert",
      },
    ],
    codeExample: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  )
}`,
    tags: ["feedback", "notification", "status", "warning"],
  },
  {
    name: "AlertDialog",
    library: "shadcn",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    whenToUse:
      "Use for destructive actions requiring confirmation, important decisions, or actions that cannot be undone.",
    installation: "npx shadcn@latest add alert-dialog",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
    ],
    codeExample: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
    tags: ["modal", "confirmation", "destructive", "dialog"],
  },
  {
    name: "AspectRatio",
    library: "shadcn",
    description:
      "Displays content within a desired ratio, maintaining consistent proportions.",
    whenToUse:
      "Use for images, videos, and maps that need to maintain a specific aspect ratio regardless of container size.",
    installation: "npx shadcn@latest add aspect-ratio",
    props: [
      {
        name: "ratio",
        type: "number",
        default: "1",
        description: "The desired aspect ratio (e.g. 16/9, 4/3)",
      },
    ],
    codeExample: `import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <img
        src="/placeholder.jpg"
        alt="Photo"
        className="rounded-md object-cover h-full w-full"
      />
    </AspectRatio>
  )
}`,
    tags: ["layout", "image", "video", "responsive"],
  },
  {
    name: "Avatar",
    library: "shadcn",
    description:
      "An image element with a fallback for representing the user or entity.",
    whenToUse:
      "Use for user profile pictures, team member photos, testimonial authors, and entity representation.",
    installation: "npx shadcn@latest add avatar",
    props: [
      {
        name: "src",
        type: "string",
        default: "undefined",
        description: "The image source URL (on AvatarImage)",
      },
      {
        name: "alt",
        type: "string",
        default: "undefined",
        description: "Alt text for the avatar image",
      },
    ],
    codeExample: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}`,
    tags: ["profile", "user", "image", "testimonial"],
  },
  {
    name: "Badge",
    library: "shadcn",
    description:
      "Displays a badge or a component that looks like a badge for status indicators and labels.",
    whenToUse:
      "Use for status indicators, category labels, counts, tags, and small pieces of metadata.",
    installation: "npx shadcn@latest add badge",
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "destructive" | "outline"',
        default: '"default"',
        description: "The visual style variant of the badge",
      },
    ],
    codeExample: `import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  )
}`,
    tags: ["label", "status", "tag", "indicator"],
  },
  {
    name: "Breadcrumb",
    library: "shadcn",
    description:
      "Displays the path to the current resource using a hierarchy of links.",
    whenToUse:
      "Use for navigation hierarchy, showing the user's current location within a site structure.",
    installation: "npx shadcn@latest add breadcrumb",
    props: [
      {
        name: "separator",
        type: "ReactNode",
        default: "<ChevronRight />",
        description: "Custom separator between breadcrumb items",
      },
    ],
    codeExample: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
    tags: ["navigation", "hierarchy", "path", "wayfinding"],
  },
  {
    name: "Button",
    library: "shadcn",
    description:
      "Displays a button or a component that looks like a button, with multiple variants and sizes.",
    whenToUse:
      "Use for primary actions, form submissions, dialog triggers, CTA buttons, and navigation actions.",
    installation: "npx shadcn@latest add button",
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        default: '"default"',
        description: "The visual style variant of the button",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        default: '"default"',
        description: "The size of the button",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Render as child element using Radix Slot",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the button is disabled",
      },
    ],
    codeExample: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}`,
    tags: ["action", "form", "interactive", "cta"],
  },
  {
    name: "Calendar",
    library: "shadcn",
    description:
      "A date field component that allows users to enter and edit dates via a calendar interface.",
    whenToUse:
      "Use for date selection in forms, booking systems, scheduling, and date range pickers.",
    installation: "npx shadcn@latest add calendar",
    props: [
      {
        name: "mode",
        type: '"single" | "multiple" | "range"',
        default: '"single"',
        description: "The selection mode of the calendar",
      },
      {
        name: "selected",
        type: "Date | Date[] | DateRange",
        default: "undefined",
        description: "The currently selected date(s)",
      },
      {
        name: "onSelect",
        type: "(date: Date | undefined) => void",
        default: "undefined",
        description: "Callback when a date is selected",
      },
      {
        name: "disabled",
        type: "Matcher | Matcher[]",
        default: "undefined",
        description: "Dates that should be disabled",
      },
    ],
    codeExample: `"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}`,
    tags: ["date", "picker", "form", "scheduling"],
  },
  {
    name: "Card",
    library: "shadcn",
    description:
      "Displays a card with header, content, and footer sections for grouping related information.",
    whenToUse:
      "Use for content containers, product cards, pricing cards, feature highlights, and dashboard widgets.",
    installation: "npx shadcn@latest add card",
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional CSS classes for the card",
      },
    ],
    codeExample: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}`,
    tags: ["container", "content", "layout", "widget"],
  },
  {
    name: "Carousel",
    library: "shadcn",
    description:
      "A carousel with motion and swipe built using Embla Carousel.",
    whenToUse:
      "Use for image galleries, testimonial sliders, product showcases, and content that needs horizontal scrolling.",
    installation: "npx shadcn@latest add carousel",
    props: [
      {
        name: "opts",
        type: "EmblaOptionsType",
        default: "{}",
        description: "Embla Carousel options (loop, align, etc.)",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "The orientation of the carousel",
      },
    ],
    codeExample: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}`,
    tags: ["slider", "gallery", "testimonial", "showcase"],
  },
  {
    name: "Checkbox",
    library: "shadcn",
    description:
      "A control that allows the user to toggle between checked and not checked.",
    whenToUse:
      "Use for boolean form fields, terms acceptance, multi-select options, and todo lists.",
    installation: "npx shadcn@latest add checkbox",
    props: [
      {
        name: "checked",
        type: 'boolean | "indeterminate"',
        default: "false",
        description: "The controlled checked state",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        default: "undefined",
        description: "Callback when checked state changes",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the checkbox is disabled",
      },
    ],
    codeExample: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}`,
    tags: ["form", "input", "toggle", "selection"],
  },
  {
    name: "Collapsible",
    library: "shadcn",
    description:
      "An interactive component which expands/collapses a panel.",
    whenToUse:
      "Use for expandable sections, show/hide content, advanced options panels, and supplementary information.",
    installation: "npx shadcn@latest add collapsible",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "false",
        description: "The controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
    ],
    codeExample: `"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost">Toggle</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">Content 1</div>
        <div className="rounded-md border px-4 py-3 text-sm">Content 2</div>
      </CollapsibleContent>
    </Collapsible>
  )
}`,
    tags: ["disclosure", "expandable", "toggle", "panel"],
  },
  {
    name: "Command",
    library: "shadcn",
    description:
      "A fast, composable command palette or search interface using cmdk.",
    whenToUse:
      "Use for command palettes, search interfaces, autocomplete, and keyboard-navigable menus.",
    installation: "npx shadcn@latest add command",
    props: [
      {
        name: "filter",
        type: "(value: string, search: string) => number",
        default: "built-in",
        description: "Custom filter function for search results",
      },
      {
        name: "shouldFilter",
        type: "boolean",
        default: "true",
        description: "Whether to filter items based on search",
      },
    ],
    codeExample: `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandDemo() {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`,
    tags: ["search", "palette", "keyboard", "navigation"],
  },
  {
    name: "ContextMenu",
    library: "shadcn",
    description:
      "Displays a menu to the user triggered by right-click, with support for submenus and keyboard navigation.",
    whenToUse:
      "Use for right-click context menus, additional actions on elements, and power-user interactions.",
    installation: "npx shadcn@latest add context-menu",
    props: [
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether the context menu should be modal",
      },
    ],
    codeExample: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Source</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`,
    tags: ["menu", "right-click", "actions", "context"],
  },
  {
    name: "Dialog",
    library: "shadcn",
    description:
      "A window overlaid on the primary window, rendering content in a layer above the page.",
    whenToUse:
      "Use for forms, confirmations, detailed views, settings panels, and any content that needs focused attention.",
    installation: "npx shadcn@latest add dialog",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether the dialog should block interaction with the page",
      },
    ],
    codeExample: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
    tags: ["modal", "overlay", "form", "popup"],
  },
  {
    name: "Drawer",
    library: "shadcn",
    description:
      "A drawer component that slides in from the edge of the screen, built on Vaul.",
    whenToUse:
      "Use for mobile-friendly dialogs, bottom sheets, navigation panels, and secondary content on small screens.",
    installation: "npx shadcn@latest add drawer",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
      {
        name: "direction",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"bottom"',
        description: "The direction the drawer slides in from",
      },
    ],
    codeExample: `import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content goes here.</p>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
    tags: ["mobile", "sheet", "panel", "overlay"],
  },
  {
    name: "DropdownMenu",
    library: "shadcn",
    description:
      "Displays a menu triggered by a button, with support for submenus, checkboxes, and radio items.",
    whenToUse:
      "Use for action menus, settings dropdowns, user account menus, and any grouped list of actions.",
    installation: "npx shadcn@latest add dropdown-menu",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether the dropdown should be modal",
      },
    ],
    codeExample: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
    tags: ["menu", "actions", "navigation", "settings"],
  },
  {
    name: "HoverCard",
    library: "shadcn",
    description:
      "Displays rich content in a portal triggered by hovering over an element.",
    whenToUse:
      "Use for user profile previews, link previews, additional context on hover, and supplementary information.",
    installation: "npx shadcn@latest add hover-card",
    props: [
      {
        name: "openDelay",
        type: "number",
        default: "700",
        description: "Delay in ms before the hover card opens",
      },
      {
        name: "closeDelay",
        type: "number",
        default: "300",
        description: "Delay in ms before the hover card closes",
      },
    ],
    codeExample: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@shadcn</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@shadcn</h4>
            <p className="text-sm">Creator of shadcn/ui.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}`,
    tags: ["preview", "tooltip", "hover", "popover"],
  },
  {
    name: "Input",
    library: "shadcn",
    description:
      "Displays a form input field for collecting user text input.",
    whenToUse:
      "Use for text fields, search bars, email inputs, password fields, and any single-line text entry.",
    installation: "npx shadcn@latest add input",
    props: [
      {
        name: "type",
        type: "string",
        default: '"text"',
        description: "The HTML input type (text, email, password, etc.)",
      },
      {
        name: "placeholder",
        type: "string",
        default: "undefined",
        description: "Placeholder text shown when empty",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the input is disabled",
      },
    ],
    codeExample: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  )
}`,
    tags: ["form", "text", "field", "input"],
  },
  {
    name: "InputOTP",
    library: "shadcn",
    description:
      "Accessible one-time password input component with copy/paste support.",
    whenToUse:
      "Use for OTP verification, PIN entry, two-factor authentication codes, and numeric verification.",
    installation: "npx shadcn@latest add input-otp",
    props: [
      {
        name: "maxLength",
        type: "number",
        default: "6",
        description: "The number of input slots",
      },
      {
        name: "value",
        type: "string",
        default: "undefined",
        description: "Controlled value",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "undefined",
        description: "Callback when value changes",
      },
    ],
    codeExample: `import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}`,
    tags: ["form", "otp", "verification", "auth"],
  },
  {
    name: "Label",
    library: "shadcn",
    description:
      "Renders an accessible label associated with form controls.",
    whenToUse:
      "Use with all form inputs, checkboxes, radio buttons, and any interactive element that needs a text label.",
    installation: "npx shadcn@latest add label",
    props: [
      {
        name: "htmlFor",
        type: "string",
        default: "undefined",
        description: "The id of the form element the label is for",
      },
    ],
    codeExample: `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  )
}`,
    tags: ["form", "accessibility", "text", "input"],
  },
  {
    name: "Menubar",
    library: "shadcn",
    description:
      "A visually persistent menu common in desktop applications, providing quick access to a consistent set of commands.",
    whenToUse:
      "Use for application menu bars, toolbar menus, and desktop-style navigation with nested options.",
    installation: "npx shadcn@latest add menubar",
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`,
    tags: ["menu", "toolbar", "navigation", "desktop"],
  },
  {
    name: "NavigationMenu",
    library: "shadcn",
    description:
      "A collection of links for navigating websites, with support for dropdown content and viewport animations.",
    whenToUse:
      "Use for main site navigation, header menus, mega menus, and primary navigation bars.",
    installation: "npx shadcn@latest add navigation-menu",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "The orientation of the navigation menu",
      },
      {
        name: "delayDuration",
        type: "number",
        default: "200",
        description: "Delay in ms before opening on hover",
      },
    ],
    codeExample: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px]">
              <li><NavigationMenuLink href="/docs">Introduction</NavigationMenuLink></li>
              <li><NavigationMenuLink href="/docs/installation">Installation</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs/components">Components</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    tags: ["navigation", "header", "menu", "links"],
  },
  {
    name: "Pagination",
    library: "shadcn",
    description:
      "Pagination with page navigation, previous and next controls.",
    whenToUse:
      "Use for paginated lists, search results, data tables, and any content split across multiple pages.",
    installation: "npx shadcn@latest add pagination",
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
    tags: ["navigation", "list", "pages", "data"],
  },
  {
    name: "Popover",
    library: "shadcn",
    description:
      "Displays rich content in a portal, triggered by a button click.",
    whenToUse:
      "Use for additional options, color pickers, date pickers, and floating forms or menus.",
    installation: "npx shadcn@latest add popover",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
    ],
    codeExample: `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}`,
    tags: ["floating", "popup", "menu", "form"],
  },
  {
    name: "Progress",
    library: "shadcn",
    description:
      "Displays an indicator showing the completion progress of a task.",
    whenToUse:
      "Use for loading states, file upload progress, step completion, and any task with measurable progress.",
    installation: "npx shadcn@latest add progress",
    props: [
      {
        name: "value",
        type: "number",
        default: "0",
        description: "The progress value (0-100)",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        description: "The maximum progress value",
      },
    ],
    codeExample: `"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}`,
    tags: ["loading", "progress", "status", "indicator"],
  },
  {
    name: "RadioGroup",
    library: "shadcn",
    description:
      "A set of checkable buttons where only one can be checked at a time.",
    whenToUse:
      "Use for single-selection from a small set of options, preferences, settings, and form choices.",
    installation: "npx shadcn@latest add radio-group",
    props: [
      {
        name: "value",
        type: "string",
        default: "undefined",
        description: "The controlled value",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "undefined",
        description: "Callback when value changes",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"vertical"',
        description: "The orientation of the radio group",
      },
    ],
    codeExample: `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}`,
    tags: ["form", "selection", "radio", "options"],
  },
  {
    name: "Resizable",
    library: "shadcn",
    description:
      "Accessible resizable panels groups and layouts with keyboard support.",
    whenToUse:
      "Use for split-pane layouts, resizable sidebars, adjustable editor panels, and customizable layouts.",
    installation: "npx shadcn@latest add resizable",
    props: [
      {
        name: "direction",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "The direction of the resizable panels",
      },
    ],
    codeExample: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}`,
    tags: ["layout", "panels", "resize", "split"],
  },
  {
    name: "ScrollArea",
    library: "shadcn",
    description:
      "Augments native scroll functionality for custom, cross-browser styled scrollbars.",
    whenToUse:
      "Use for scrollable containers, long lists, code blocks, and any content that needs custom scrollbar styling.",
    installation: "npx shadcn@latest add scroll-area",
    props: [
      {
        name: "type",
        type: '"auto" | "always" | "scroll" | "hover"',
        default: '"hover"',
        description: "When the scrollbar should be visible",
      },
      {
        name: "scrollHideDelay",
        type: "number",
        default: "600",
        description: "Delay in ms before hiding scrollbar after scroll ends",
      },
    ],
    codeExample: `import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map((_, i) => \`Tag \${i + 1}\`)

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}`,
    tags: ["scroll", "container", "overflow", "list"],
  },
  {
    name: "Select",
    library: "shadcn",
    description:
      "Displays a list of options for the user to pick from, triggered by a button.",
    whenToUse:
      "Use for dropdowns, form selects, option pickers, and any selection from a list of choices.",
    installation: "npx shadcn@latest add select",
    props: [
      {
        name: "value",
        type: "string",
        default: "undefined",
        description: "The controlled value",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "undefined",
        description: "Callback when value changes",
      },
      {
        name: "defaultValue",
        type: "string",
        default: "undefined",
        description: "The default selected value",
      },
    ],
    codeExample: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
    tags: ["form", "dropdown", "selection", "picker"],
  },
  {
    name: "Separator",
    library: "shadcn",
    description:
      "Visually or semantically separates content with a horizontal or vertical line.",
    whenToUse:
      "Use between content sections, menu items, form groups, and anywhere you need visual separation.",
    installation: "npx shadcn@latest add separator",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "The orientation of the separator",
      },
      {
        name: "decorative",
        type: "boolean",
        default: "true",
        description: "Whether the separator is decorative (hidden from screen readers)",
      },
    ],
    codeExample: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}`,
    tags: ["divider", "layout", "spacing", "visual"],
  },
  {
    name: "Sheet",
    library: "shadcn",
    description:
      "Extends the Dialog component to display content that complements the main content of the screen, sliding in from the side.",
    whenToUse:
      "Use for side panels, mobile navigation, filter panels, settings, and supplementary content.",
    installation: "npx shadcn@latest add sheet",
    props: [
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when open state changes",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"right"',
        description: "The side the sheet slides in from",
      },
    ],
    codeExample: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Sheet content goes here.</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}`,
    tags: ["panel", "sidebar", "mobile", "overlay"],
  },
  {
    name: "Skeleton",
    library: "shadcn",
    description:
      "Use to show a placeholder while content is loading.",
    whenToUse:
      "Use for loading states, content placeholders, lazy-loaded content, and perceived performance improvement.",
    installation: "npx shadcn@latest add skeleton",
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "CSS classes to control size and shape",
      },
    ],
    codeExample: `import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}`,
    tags: ["loading", "placeholder", "skeleton", "lazy"],
  },
  {
    name: "Slider",
    library: "shadcn",
    description:
      "An input where the user selects a value from within a given range.",
    whenToUse:
      "Use for volume controls, price range filters, numeric ranges, and any continuous value selection.",
    installation: "npx shadcn@latest add slider",
    props: [
      {
        name: "value",
        type: "number[]",
        default: "[0]",
        description: "The controlled value",
      },
      {
        name: "onValueChange",
        type: "(value: number[]) => void",
        default: "undefined",
        description: "Callback when value changes",
      },
      {
        name: "min",
        type: "number",
        default: "0",
        description: "The minimum value",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        description: "The maximum value",
      },
      {
        name: "step",
        type: "number",
        default: "1",
        description: "The step increment",
      },
    ],
    codeExample: `import { Slider } from "@/components/ui/slider"

export function SliderDemo() {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className="w-[60%]"
    />
  )
}`,
    tags: ["form", "range", "input", "numeric"],
  },
  {
    name: "Sonner",
    library: "shadcn",
    description:
      "An opinionated toast notification component built on top of sonner.",
    whenToUse:
      "Use for success/error/info notifications, action confirmations, and non-blocking user feedback.",
    installation: "npx shadcn@latest add sonner",
    props: [
      {
        name: "position",
        type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
        default: '"bottom-right"',
        description: "The position of the toast",
      },
      {
        name: "richColors",
        type: "boolean",
        default: "false",
        description: "Enable rich colors for different toast types",
      },
    ],
    codeExample: `import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}`,
    tags: ["notification", "toast", "feedback", "alert"],
  },
  {
    name: "Switch",
    library: "shadcn",
    description:
      "A control that allows the user to toggle between a checked and unchecked state.",
    whenToUse:
      "Use for on/off toggles, feature flags, boolean settings, dark mode switches, and preferences.",
    installation: "npx shadcn@latest add switch",
    props: [
      {
        name: "checked",
        type: "boolean",
        default: "false",
        description: "The controlled checked state",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        default: "undefined",
        description: "Callback when checked state changes",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the switch is disabled",
      },
    ],
    codeExample: `import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}`,
    tags: ["form", "toggle", "boolean", "settings"],
  },
  {
    name: "Table",
    library: "shadcn",
    description:
      "A responsive table component for displaying tabular data.",
    whenToUse:
      "Use for data tables, pricing comparisons, feature lists, schedules, and any structured data display.",
    installation: "npx shadcn@latest add table",
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional CSS classes",
      },
    ],
    codeExample: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
    tags: ["data", "table", "list", "display"],
  },
  {
    name: "Tabs",
    library: "shadcn",
    description:
      "A set of layered sections of content displayed one at a time, known as tab panels.",
    whenToUse:
      "Use for organizing content into sections, settings pages, dashboard views, and categorized content.",
    installation: "npx shadcn@latest add tabs",
    props: [
      {
        name: "value",
        type: "string",
        default: "undefined",
        description: "The controlled active tab value",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "undefined",
        description: "Callback when active tab changes",
      },
      {
        name: "defaultValue",
        type: "string",
        default: "undefined",
        description: "The default active tab",
      },
    ],
    codeExample: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p>Make changes to your account here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p>Change your password here.</p>
      </TabsContent>
    </Tabs>
  )
}`,
    tags: ["navigation", "tabs", "sections", "organize"],
  },
  {
    name: "Textarea",
    library: "shadcn",
    description:
      "Displays a form textarea for multi-line text input.",
    whenToUse:
      "Use for multi-line text input, comments, descriptions, messages, and long-form text entry.",
    installation: "npx shadcn@latest add textarea",
    props: [
      {
        name: "placeholder",
        type: "string",
        default: "undefined",
        description: "Placeholder text shown when empty",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the textarea is disabled",
      },
      {
        name: "rows",
        type: "number",
        default: "3",
        description: "Number of visible text lines",
      },
    ],
    codeExample: `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function TextareaDemo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}`,
    tags: ["form", "text", "input", "multiline"],
  },
  {
    name: "Toast",
    library: "shadcn",
    description:
      "A succinct message that is displayed temporarily as a toast notification.",
    whenToUse:
      "Use for brief notifications, action confirmations, error messages, and non-intrusive alerts.",
    installation: "npx shadcn@latest add toast",
    props: [
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "The visual style of the toast",
      },
      {
        name: "duration",
        type: "number",
        default: "5000",
        description: "Duration in ms before auto-dismiss",
      },
    ],
    codeExample: `"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
  )
}`,
    tags: ["notification", "feedback", "alert", "message"],
  },
  {
    name: "Toggle",
    library: "shadcn",
    description:
      "A two-state button that can be either on or off.",
    whenToUse:
      "Use for toggling bold/italic in editors, on/off states, view mode switches, and binary options.",
    installation: "npx shadcn@latest add toggle",
    props: [
      {
        name: "variant",
        type: '"default" | "outline"',
        default: '"default"',
        description: "The visual style variant",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        default: '"default"',
        description: "The size of the toggle",
      },
      {
        name: "pressed",
        type: "boolean",
        default: "false",
        description: "The controlled pressed state",
      },
      {
        name: "onPressedChange",
        type: "(pressed: boolean) => void",
        default: "undefined",
        description: "Callback when pressed state changes",
      },
    ],
    codeExample: `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}`,
    tags: ["button", "toggle", "state", "editor"],
  },
  {
    name: "ToggleGroup",
    library: "shadcn",
    description:
      "A set of two-state buttons that can be toggled on or off, functioning as a group.",
    whenToUse:
      "Use for view mode selectors (grid/list), text alignment controls, filter toggles, and grouped options.",
    installation: "npx shadcn@latest add toggle-group",
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        default: '"single"',
        description: "Whether single or multiple items can be toggled",
      },
      {
        name: "value",
        type: "string | string[]",
        default: "undefined",
        description: "The controlled value(s)",
      },
      {
        name: "onValueChange",
        type: "(value: string | string[]) => void",
        default: "undefined",
        description: "Callback when value changes",
      },
      {
        name: "variant",
        type: '"default" | "outline"',
        default: '"default"',
        description: "The visual style variant",
      },
    ],
    codeExample: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`,
    tags: ["button", "group", "toggle", "toolbar"],
  },
  {
    name: "Tooltip",
    library: "shadcn",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    whenToUse:
      "Use for icon button labels, additional context, abbreviated text expansion, and helpful hints.",
    installation: "npx shadcn@latest add tooltip",
    props: [
      {
        name: "delayDuration",
        type: "number",
        default: "700",
        description: "Delay in ms before showing the tooltip",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "The preferred side of the trigger to render",
      },
    ],
    codeExample: `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
    tags: ["hint", "label", "hover", "accessibility"],
  },
  {
    name: "Sidebar",
    library: "shadcn",
    description:
      "A composable, themeable, and customizable sidebar component for building dashboard layouts.",
    whenToUse:
      "Use for dashboard navigation, admin panels, app layouts with persistent side navigation.",
    installation: "npx shadcn@latest add sidebar",
    props: [
      {
        name: "side",
        type: '"left" | "right"',
        default: '"left"',
        description: "The side the sidebar appears on",
      },
      {
        name: "variant",
        type: '"sidebar" | "floating" | "inset"',
        default: '"sidebar"',
        description: "The visual variant of the sidebar",
      },
      {
        name: "collapsible",
        type: '"offcanvas" | "icon" | "none"',
        default: '"offcanvas"',
        description: "How the sidebar collapses",
      },
    ],
    codeExample: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Settings } from "lucide-react"

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  )
}`,
    tags: ["navigation", "layout", "dashboard", "panel"],
  },
  {
    name: "Chart",
    library: "shadcn",
    description:
      "Beautiful chart components built on top of Recharts with built-in theming and tooltip support.",
    whenToUse:
      "Use for data visualization, dashboards, analytics, reports, and any graphical data representation.",
    installation: "npx shadcn@latest add chart",
    props: [
      {
        name: "config",
        type: "ChartConfig",
        default: "{}",
        description: "Chart configuration for colors and labels",
      },
    ],
    codeExample: `"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}`,
    tags: ["data", "visualization", "graph", "analytics"],
  },
];

const OUTPUT_DIR = join(process.cwd(), "data", "components", "shadcn");

function toFileName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let count = 0;
  for (const component of components) {
    const fileName = `${toFileName(component.name)}.json`;
    const filePath = join(OUTPUT_DIR, fileName);
    writeFileSync(filePath, JSON.stringify(component, null, 2) + "\n");
    count++;
    console.log(`  Created: ${fileName}`);
  }

  console.log(`\nDone! Generated ${count} component JSON files in data/components/shadcn/`);
}

main();
