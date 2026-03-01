import * as cheerio from 'cheerio';
import type { ExtractedProduct, SiteConfig } from './types';
import { rupeesToPaise } from '@wishpal/shared';

/**
 * Tier 2: Extract product data using site-specific CSS selectors.
 * Free, fast, requires maintained selector configs.
 */
export function extractWithSelectors(
  html: string,
  config: SiteConfig,
): Partial<ExtractedProduct> | null {
  const $ = cheerio.load(html);
  const s = config.selectors;

  const title = $(s.title).first().text().trim();
  if (!title) return null;

  const result: Partial<ExtractedProduct> = { title };

  // Price
  const priceRaw = $(s.price).first().text().trim();
  if (priceRaw) {
    const transform = config.priceTransform || ((raw: string) => rupeesToPaise(raw));
    result.pricePaise = transform(priceRaw);
    result.currency = 'INR';
  }

  // Original price
  if (s.originalPrice) {
    const origRaw = $(s.originalPrice).first().text().trim();
    if (origRaw) {
      const transform = config.priceTransform || ((raw: string) => rupeesToPaise(raw));
      result.originalPricePaise = transform(origRaw);
    }
  }

  // Image
  if (s.image) {
    const imgEl = $(s.image).first();
    const imgUrl = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-old-hires');
    if (imgUrl) {
      result.imageUrl = imgUrl;
      result.images = [imgUrl];
    }
  }

  // Description
  if (s.description) {
    result.description = $(s.description).first().text().trim().slice(0, 500);
  }

  // Brand
  if (s.brand) {
    result.brand = $(s.brand).first().text().trim().replace(/^(Brand:|Visit the\s+)/i, '').trim();
  }

  // Rating
  if (s.rating) {
    const ratingText = $(s.rating).first().text().trim();
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    if (ratingMatch) result.rating = parseFloat(ratingMatch[1]);
  }

  // Review count
  if (s.reviewCount) {
    const reviewText = $(s.reviewCount).first().text().trim();
    const reviewMatch = reviewText.match(/([\d,]+)/);
    if (reviewMatch) result.reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''), 10);
  }

  // In stock
  if (s.inStock) {
    const stockText = $(s.inStock).first().text().trim().toLowerCase();
    result.inStock = !stockText.includes('unavailable') && !stockText.includes('out of stock');
  }

  return result;
}
