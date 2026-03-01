import type { SiteConfig } from './types';
import { rupeesToPaise } from '@wishpal/shared';

export const siteConfigs: SiteConfig[] = [
  {
    domain: 'amazon.in',
    selectors: {
      title: '#productTitle, #title',
      price: '.a-price-whole, #priceblock_ourprice, #priceblock_dealprice, .priceToPay .a-price-whole',
      originalPrice: '.a-text-price .a-offscreen, #priceblock_ourprice',
      image: '#landingImage, #imgBlkFront',
      description: '#feature-bullets',
      brand: '#bylineInfo, .po-brand .po-break-word',
      rating: '#acrPopover .a-icon-alt',
      reviewCount: '#acrCustomerReviewText',
      inStock: '#availability',
    },
    priceTransform: (raw) => rupeesToPaise(raw),
  },
  {
    domain: 'amazon.com',
    selectors: {
      title: '#productTitle',
      price: '.a-price-whole, #priceblock_ourprice',
      originalPrice: '.a-text-price .a-offscreen',
      image: '#landingImage',
      description: '#feature-bullets',
      brand: '#bylineInfo',
      rating: '#acrPopover .a-icon-alt',
      reviewCount: '#acrCustomerReviewText',
    },
  },
  {
    domain: 'flipkart.com',
    selectors: {
      title: '.VU-ZEz, ._35KyD6',
      price: '.Nx9bqj.CxhGGd, ._30jeq3._16Jk6d',
      originalPrice: '.yRaY8j.A6\\+E6v, ._3I9_wc._2p6lqe',
      image: '.DByuf4 img, ._396cs4._2amPTt._3qGmMb',
      description: '.yN\\+eNk, ._1mXcCf',
      brand: '.mEh187, ._2WkVRV',
      rating: '.XQDdHH, ._3LWZlK',
      reviewCount: '.Wphh3N span:last-child',
    },
    priceTransform: (raw) => rupeesToPaise(raw),
  },
  {
    domain: 'myntra.com',
    selectors: {
      title: '.pdp-title, .pdp-name',
      price: '.pdp-price strong',
      originalPrice: '.pdp-mrp s',
      image: '.image-grid-image',
      brand: '.pdp-title',
    },
    priceTransform: (raw) => rupeesToPaise(raw),
  },
];

export function getSiteConfig(domain: string): SiteConfig | undefined {
  return siteConfigs.find((c) => domain.includes(c.domain));
}
