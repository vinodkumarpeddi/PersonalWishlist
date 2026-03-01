import * as cheerio from 'cheerio';
import type { ExtractedProduct } from './types';
import { rupeesToPaise } from '@wishpal/shared';

/**
 * Tier 1: Extract product data from structured data (JSON-LD, OpenGraph, Microdata).
 * Free, fast, no site-specific selectors needed.
 */
export function extractStructuredData(html: string): Partial<ExtractedProduct> | null {
  const $ = cheerio.load(html);
  const result: Partial<ExtractedProduct> = {};

  // Try JSON-LD first (most reliable)
  const jsonLd = extractJsonLd($);
  if (jsonLd) Object.assign(result, jsonLd);

  // Supplement with OpenGraph
  const og = extractOpenGraph($);
  if (og.title && !result.title) result.title = og.title;
  if (og.imageUrl && !result.imageUrl) result.imageUrl = og.imageUrl;
  if (og.description && !result.description) result.description = og.description;

  // Supplement with standard meta
  if (!result.title) result.title = $('title').text().trim();

  if (!result.title) return null;

  return result;
}

function extractJsonLd($: cheerio.CheerioAPI): Partial<ExtractedProduct> | null {
  const scripts = $('script[type="application/ld+json"]');
  let product: Record<string, unknown> | null = null;

  scripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '');
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type']?.includes?.('Product')) {
          product = item;
          break;
        }
        // Check @graph
        if (item['@graph']) {
          const found = (item['@graph'] as Record<string, unknown>[]).find(
            (g) => g['@type'] === 'Product' || (g['@type'] as string)?.includes?.('Product'),
          );
          if (found) {
            product = found;
            break;
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  });

  if (!product) return null;

  const p = product as Record<string, unknown>;
  const result: Partial<ExtractedProduct> = {};

  result.title = p.name as string;
  result.description = p.description as string;

  // Image
  const image = p.image;
  if (typeof image === 'string') {
    result.imageUrl = image;
    result.images = [image];
  } else if (Array.isArray(image)) {
    result.images = image.map((i: unknown) => (typeof i === 'string' ? i : (i as Record<string, string>)?.url || ''));
    result.imageUrl = result.images[0];
  }

  // Price from offers
  const offers = p.offers as Record<string, unknown> | Record<string, unknown>[] | undefined;
  if (offers) {
    const offer = Array.isArray(offers) ? offers[0] : offers;
    const price = Number(offer.price || offer.lowPrice);
    if (price > 0) {
      const currency = (offer.priceCurrency as string) || 'INR';
      result.currency = currency;
      result.pricePaise = Math.round(price * 100);
    }
    result.inStock = (offer.availability as string)?.includes('InStock') ?? true;
  }

  // Brand
  const brand = p.brand as Record<string, string> | string | undefined;
  if (typeof brand === 'string') result.brand = brand;
  else if (brand?.name) result.brand = brand.name;

  // Rating
  const rating = p.aggregateRating as Record<string, unknown> | undefined;
  if (rating) {
    result.rating = Number(rating.ratingValue);
    result.reviewCount = Number(rating.reviewCount || rating.ratingCount);
  }

  return result;
}

function extractOpenGraph($: cheerio.CheerioAPI): Partial<ExtractedProduct> {
  return {
    title: $('meta[property="og:title"]').attr('content'),
    description: $('meta[property="og:description"]').attr('content'),
    imageUrl: $('meta[property="og:image"]').attr('content'),
  };
}
