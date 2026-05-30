/**
 * lib/image-utils.ts
 * Utility for handling image URLs, especially for Supabase Storage.
 */

// Use relative path for Next.js rewrite proxy
const ASSET_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`
  : '';

const BUCKET_NAME = "products";

/**
 * Transforms a local path or filename into a full Supabase Storage URL.
 * If the input is already a full URL (http/https), it returns it as-is.
 * 
 * @param path The local path or filename (e.g., "/images/tees1.png" or "tees1.png")
 * @returns The full Supabase Storage URL or an empty string if none
 */
export function getImageUrl(pathInput: string | string[] | null | undefined): string {
  const path = Array.isArray(pathInput) ? pathInput[0] : pathInput;
  if (!path) return "";

  // If it's already an absolute URL, data URI, or a root-relative local path, return it
  if (
    path.startsWith("http://") || 
    path.startsWith("https://") || 
    path.startsWith("data:") ||
    path.startsWith("/")
  ) {
    return path;
  }

  // Clean up path: strip 'images/' prefix if it exists but is not root-relative
  let cleanPath = path;
  if (cleanPath.startsWith("images/")) cleanPath = cleanPath.slice(7);

  // Use Gateway Proxy if available, otherwise fallback to local empty
  if (!ASSET_BASE) {
    return "";
  }

  return `${ASSET_BASE}/${BUCKET_NAME}/${cleanPath}`;
}
