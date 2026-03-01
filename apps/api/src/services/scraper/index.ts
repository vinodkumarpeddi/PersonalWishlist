import { chromium, type Browser } from 'playwright';
import { extractStructuredData } from './tier1-structured';
import { extractWithSelectors } from './tier2-selectors';
import { getSiteConfig } from './site-configs';
import type { ExtractedProduct } from './types';
import { extractDomain, normalizeUrl } from '@wishpal/shared';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance?.isConnected()) return browserInstance;

  browserInstance = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  return browserInstance;
}

export async function scrapeProduct(url: string): Promise<ExtractedProduct> {
  const domain = extractDomain(url);
  const normalizedUrl = normalizeUrl(url);
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  logger.info(`Scraping: ${domain} — ${normalizedUrl}`);

  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: ua,
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: env.scraperTimeoutMs,
    });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    const html = await page.content();

    // Tier 1: Structured data
    let result = extractStructuredData(html);
    if (result?.title && result?.pricePaise) {
      logger.info(`Tier 1 success for ${domain}`);
      return buildProduct(result, url, domain);
    }

    // Tier 2: Site-specific selectors
    const siteConfig = getSiteConfig(domain);
    if (siteConfig) {
      const selectorResult = extractWithSelectors(html, siteConfig);
      if (selectorResult?.title) {
        // Merge with tier 1 results
        result = { ...result, ...selectorResult };
        if (result.title && result.pricePaise) {
          logger.info(`Tier 2 success for ${domain}`);
          return buildProduct(result, url, domain);
        }
      }
    }

    // Tier 3: LLM-based (placeholder)
    logger.info(`Tiers 1-2 insufficient for ${domain}, would invoke LLM (Tier 3)`);

    // Return whatever we have
    if (result?.title) {
      return buildProduct(result, url, domain);
    }

    throw new Error(`Could not extract product data from ${domain}`);
  } finally {
    await context.close();
  }
}

function buildProduct(partial: Partial<ExtractedProduct>, url: string, domain: string): ExtractedProduct {
  return {
    title: partial.title || 'Unknown Product',
    description: partial.description,
    imageUrl: partial.imageUrl,
    images: partial.images || (partial.imageUrl ? [partial.imageUrl] : []),
    pricePaise: partial.pricePaise || 0,
    originalPricePaise: partial.originalPricePaise,
    currency: partial.currency || 'INR',
    inStock: partial.inStock ?? true,
    brand: partial.brand,
    category: partial.category,
    rating: partial.rating,
    reviewCount: partial.reviewCount,
    metadata: { sourceUrl: url, domain, ...partial.metadata },
  };
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

export type { ExtractedProduct };
