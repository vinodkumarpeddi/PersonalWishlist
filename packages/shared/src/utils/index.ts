// ============================================
// Price Formatting (Indian Numbering System)
// ============================================

/**
 * Format paise amount to Indian currency string.
 * e.g., 12345600 paise → "₹1,23,456"
 */
export function formatPriceINR(paise: number): string {
  const rupees = paise / 100;
  return '₹' + formatIndianNumber(rupees);
}

/**
 * Format number using Indian numbering system.
 * e.g., 123456.78 → "1,23,456.78"
 */
export function formatIndianNumber(num: number): string {
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  // Remove decimals if they're .00
  const showDecimals = decPart !== '00';

  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);

  let formatted = lastThree;
  if (rest.length > 0) {
    formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return showDecimals ? `${formatted}.${decPart}` : formatted;
}

/**
 * Format price with any currency symbol.
 */
export function formatPrice(paise: number, currency: string = 'INR'): string {
  if (currency === 'INR') return formatPriceINR(paise);
  const amount = paise / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Convert rupees string to paise.
 * e.g., "1,23,456.78" → 12345678
 */
export function rupeesToPaise(rupees: string | number): number {
  const cleaned = typeof rupees === 'string' ? rupees.replace(/[₹,\s]/g, '') : rupees;
  return Math.round(Number(cleaned) * 100);
}

// ============================================
// URL Utilities
// ============================================

/**
 * Normalize a product URL for deduplication.
 * Strips tracking params, fragments, trailing slashes.
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Remove common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'tag', 'psc', 'linkCode', 'th', 'keywords',
      'fbclid', 'gclid', 'dclid', 'msclkid',
    ];
    trackingParams.forEach((p) => parsed.searchParams.delete(p));

    // Remove fragment
    parsed.hash = '';

    // Lowercase hostname
    let normalized = parsed.toString();

    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');

    return normalized;
  } catch {
    return url;
  }
}

/**
 * Extract domain from URL.
 * e.g., "https://www.amazon.in/dp/B123" → "amazon.in"
 */
export function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// ============================================
// Date Utilities
// ============================================

/**
 * Format date to relative time string.
 * e.g., "2 hours ago", "3 days ago"
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format date for display.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ============================================
// Misc Utilities
// ============================================

/**
 * Calculate discount percentage.
 */
export function calcDiscount(currentPaise: number, originalPaise: number): number {
  if (!originalPaise || originalPaise <= currentPaise) return 0;
  return Math.round(((originalPaise - currentPaise) / originalPaise) * 100);
}

/**
 * Truncate string with ellipsis.
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

/**
 * Delay utility for async operations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
