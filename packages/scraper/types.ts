/** Raw data returned from Google Places API */
export interface GooglePlaceData {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  totalReviews?: number
  hours?: string[]
  categories: string[]
  photoUrls: string[]
  reviews: GooglePlaceReview[]
  location: {
    lat: number
    lng: number
  }
}

export interface GooglePlaceReview {
  author: string
  rating: number
  text: string
  relativeTime: string
}

/** Content scraped from a business's existing website */
export interface ScrapedWebsiteData {
  url: string
  title?: string
  description?: string
  headings: string[]
  paragraphs: string[]
  menuItems?: string[]
  aboutText?: string
  imageUrls: string[]
}

/** Structured business hours entry */
export interface BusinessHours {
  day: string
  open: string
  close: string
}

/** Structured photo with dimensions */
export interface BusinessPhoto {
  url: string
  width: number
  height: number
}

/** Structured review for site generation */
export interface BusinessReview {
  author: string
  rating: number
  text: string
  date: string
}

/** Extracted content from an existing business website */
export interface ExistingContent {
  headlines: string[]
  descriptions: string[]
  services: string[]
  about: string
}

/** Combined business profile used for site generation */
export interface BusinessProfile {
  name: string
  address: string
  city: string
  state: string
  phone: string
  website?: string
  rating: number
  reviewCount: number
  category: string
  industry: string
  hours: BusinessHours[]
  photos: BusinessPhoto[]
  reviews: BusinessReview[]
  location: {
    lat: number
    lng: number
  }
  existingContent?: ExistingContent
}
