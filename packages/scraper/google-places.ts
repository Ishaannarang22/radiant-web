import {
  Client,
  PlaceInputType,
  Status,
} from "@googlemaps/google-maps-services-js"
import type { GooglePlaceData, GooglePlaceReview } from "./types"

const client = new Client({})

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY
  if (!apiKey) {
    throw new Error("Missing GOOGLE_CLOUD_API_KEY environment variable")
  }
  return apiKey
}

/**
 * Search for a business on Google Places by name and location.
 * Returns the place_id of the best match, or null if not found.
 */
export async function searchBusiness(
  name: string,
  location: string,
): Promise<string | null> {
  const key = getApiKey()
  const input = `${name} ${location}`

  try {
    const response = await client.findPlaceFromText({
      params: {
        key,
        input,
        inputtype: PlaceInputType.textQuery,
        fields: ["place_id", "name", "formatted_address"],
      },
    })

    if (
      response.data.status !== Status.OK ||
      !response.data.candidates?.length
    ) {
      return null
    }

    return response.data.candidates[0].place_id ?? null
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("OVER_QUERY_LIMIT") || message.includes("quota")) {
      throw new Error(`Google Places API quota exceeded: ${message}`)
    }
    throw new Error(`Google Places search failed: ${message}`)
  }
}

/**
 * Get full details for a place by its place_id.
 * Returns structured GooglePlaceData or null if the place can't be found.
 */
export async function getPlaceDetails(
  placeId: string,
): Promise<GooglePlaceData | null> {
  const key = getApiKey()

  try {
    const response = await client.placeDetails({
      params: {
        key,
        place_id: placeId,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "formatted_phone_number",
          "international_phone_number",
          "website",
          "rating",
          "user_ratings_total",
          "opening_hours",
          "types",
          "photos",
          "reviews",
          "geometry",
        ],
      },
    })

    if (response.data.status !== Status.OK || !response.data.result) {
      return null
    }

    const place = response.data.result

    const reviews: GooglePlaceReview[] = (place.reviews ?? []).map((r) => ({
      author: r.author_name ?? "Anonymous",
      rating: r.rating ?? 0,
      text: r.text ?? "",
      relativeTime: r.relative_time_description ?? "",
    }))

    const photoReferences = (place.photos ?? []).map((p) => p.photo_reference)

    return {
      placeId: place.place_id!,
      name: place.name ?? "",
      address: place.formatted_address ?? "",
      phone: place.formatted_phone_number ?? place.international_phone_number,
      website: place.website,
      rating: place.rating,
      totalReviews: place.user_ratings_total,
      hours: place.opening_hours?.weekday_text,
      categories: place.types ?? [],
      photoUrls: getPlacePhotoUrls(photoReferences, 800, key),
      reviews,
      location: {
        lat: place.geometry?.location?.lat ?? 0,
        lng: place.geometry?.location?.lng ?? 0,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("OVER_QUERY_LIMIT") || message.includes("quota")) {
      throw new Error(`Google Places API quota exceeded: ${message}`)
    }
    if (message.includes("NOT_FOUND") || message.includes("INVALID_REQUEST")) {
      return null
    }
    throw new Error(`Google Places details failed: ${message}`)
  }
}

/**
 * Build Google Places photo URLs from photo references.
 * These URLs can be used directly in <img> tags — Google will redirect to the actual image.
 */
export function getPlacePhotoUrls(
  photoReferences: string[],
  maxWidth: number = 800,
  apiKey?: string,
): string[] {
  const key = apiKey ?? getApiKey()
  return photoReferences.map(
    (ref) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${ref}&key=${key}`,
  )
}

/**
 * High-level function: search for a business and return full details.
 * Combines searchBusiness + getPlaceDetails in one call.
 */
export async function findBusiness(
  name: string,
  location: string,
): Promise<GooglePlaceData | null> {
  const placeId = await searchBusiness(name, location)
  if (!placeId) return null
  return getPlaceDetails(placeId)
}

export { client as googleMapsClient }
