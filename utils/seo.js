import { cache } from "react";
import { getOne as getPlaceApi } from "@/services/places/places.service";
import { getOne as getProductApi } from "@/services/porducts/products.service";
import { getOne as getEventApi } from "@/services/events/events.service";
import { getOne as getNightApi } from "@/services/nights/nights.service";
import { getOne as getGovApi } from "@/services/govenorates/govenorates.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";
import { gamesEn } from "@/data";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://M360.vercel.app";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/og-image.jpg`;

/**
 * Ensures an image or link URL is absolute.
 */
export function toAbsoluteUrl(url) {
  if (!url || typeof url !== "string") return DEFAULT_OG_IMAGE;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Builds a comprehensive Next.js Metadata object with OpenGraph and Twitter cards.
 */
export function buildSEO({
  title,
  description,
  image,
  url,
  type = "website",
  noindex = false,
  extraOpenGraph = {},
  extraTwitter = {},
}) {
  const formattedTitle = title?.includes("M360")
    ? title
    : `${title || "Explore Egypt"} | M360`;

  const cleanDescription =
    description ||
    "M360 is your ultimate interactive platform to explore Egypt. Discover historic places, vibrant nightlife, authentic marketplace products, upcoming events, and cultural games.";

  const absImage = toAbsoluteUrl(image);
  const canonicalUrl = url
    ? url.startsWith("http")
      ? url
      : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`
    : SITE_URL;

  return {
    title: formattedTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: formattedTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "M360",
      type,
      locale: "en_US",
      images: [
        {
          url: absImage,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
      ...extraOpenGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: cleanDescription,
      images: [absImage],
      ...extraTwitter,
    },
    ...(noindex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
        }
      : {}),
  };
}

/**
 * Cached server fetcher for Place by slug or ID
 */
export const getCachedPlace = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await getPlaceApi(slug);
    return res?.data?.place || res?.place || null;
  } catch (err) {
    console.error(
      `[SEO] Failed to fetch place for slug: ${slug}`,
      err?.message,
    );
    return null;
  }
});

/**
 * Cached server fetcher for Product by slug or ID
 */
export const getCachedProduct = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await getProductApi(slug);
    const raw = res?.data?.data || res?.data || res;
    return normalizeProduct(raw);
  } catch (err) {
    console.error(
      `[SEO] Failed to fetch product for slug: ${slug}`,
      err?.message,
    );
    return null;
  }
});

/**
 * Cached server fetcher for Event by slug or ID
 */
export const getCachedEvent = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await getEventApi(slug);
    const data = res?.data;
    return data?.event || data?.data?.event || data?.data || data || null;
  } catch (err) {
    console.error(
      `[SEO] Failed to fetch event for slug: ${slug}`,
      err?.message,
    );
    return null;
  }
});

/**
 * Cached server fetcher for Night by slug or ID
 */
export const getCachedNight = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await getNightApi(slug);
    const data = res?.data;
    return data?.night || data?.data?.night || data?.data || data || null;
  } catch (err) {
    console.error(
      `[SEO] Failed to fetch night for slug: ${slug}`,
      err?.message,
    );
    return null;
  }
});

/**
 * Cached server fetcher for Governorate by slug or ID
 */
export const getCachedGovernorate = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await getGovApi(slug);
    return res?.data?.governorate || res?.data || null;
  } catch (err) {
    console.error(
      `[SEO] Failed to fetch governorate for slug: ${slug}`,
      err?.message,
    );
    return null;
  }
});

/**
 * Local lookup for Game by slug or ID
 */
export function getGameBySlug(slug) {
  if (!slug) return null;
  const found = gamesEn.find(
    (g) => String(g.id) === String(slug) || String(g._id) === String(slug),
  );
  return found || null;
}
