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

/** Combined business profile used for site generation */
export interface BusinessProfile {
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  totalReviews?: number
  hours?: string[]
  industry: string
  categories: string[]
  photoUrls: string[]
  reviews: GooglePlaceReview[]
  location: {
    lat: number
    lng: number
  }
  scrapedContent?: ScrapedWebsiteData
}
