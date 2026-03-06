import {
  Client,
  PlaceInputType,
} from "@googlemaps/google-maps-services-js"
import type { GooglePlaceData } from "./types"

const client = new Client({})

/**
 * Search for a business on Google Places and return structured data.
 * Implementation will be completed in Phase 3.
 */
export async function findBusiness(
  name: string,
  location: string,
): Promise<GooglePlaceData | null> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY
  if (!apiKey) {
    throw new Error("Missing GOOGLE_CLOUD_API_KEY environment variable")
  }

  // Phase 3: Implement full Google Places lookup
  // 1. findPlaceFromText to get place_id
  // 2. placeDetails to get full info (name, address, phone, hours, reviews, photos)
  // 3. Map response to GooglePlaceData

  throw new Error("Not implemented — will be completed in Phase 3")
}

export { client as googleMapsClient }
