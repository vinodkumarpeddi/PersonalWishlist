import { ProductModel } from '../models/product.model';
import { PriceHistoryModel } from '../models/price-history.model';
import { scrapeProduct } from './scraper';
import { normalizeUrl, extractDomain } from '@wishpal/shared';
import { logger } from '../utils/logger';

export class ProductService {
  async extractAndSave(url: string) {
    const normalizedUrl = normalizeUrl(url);
    const domain = extractDomain(url);

    // Check if product already exists
    const existing = await ProductModel.findOne({ normalizedUrl });
    if (existing && existing.scrapeStatus === 'completed') {
      return existing;
    }

    // Create or update product as pending
    let product = existing || new ProductModel({
      url,
      normalizedUrl,
      domain,
      title: 'Extracting...',
      currentPricePaise: 0,
      scrapeStatus: 'processing',
    });

    product.scrapeStatus = 'processing';
    await product.save();

    try {
      const extracted = await scrapeProduct(url);

      product.title = extracted.title;
      product.description = extracted.description;
      product.imageUrl = extracted.imageUrl;
      product.images = extracted.images;
      product.currentPricePaise = extracted.pricePaise;
      product.originalPricePaise = extracted.originalPricePaise;
      product.currency = extracted.currency;
      product.inStock = extracted.inStock;
      product.brand = extracted.brand;
      product.category = extracted.category;
      product.rating = extracted.rating;
      product.reviewCount = extracted.reviewCount;
      product.metadata = extracted.metadata;
      product.lastScrapedAt = new Date();
      product.scrapeStatus = 'completed';

      await product.save();

      // Record initial price
      await PriceHistoryModel.create({
        productId: product._id,
        pricePaise: extracted.pricePaise,
        currency: extracted.currency,
        inStock: extracted.inStock,
      });

      logger.info(`Product extracted: ${extracted.title} (${domain})`);
      return product;
    } catch (error) {
      product.scrapeStatus = 'failed';
      await product.save();
      logger.error(`Scrape failed for ${url}:`, error);
      throw error;
    }
  }

  async getProduct(productId: string) {
    return ProductModel.findById(productId);
  }

  async getPriceHistory(productId: string) {
    return PriceHistoryModel.find({ productId })
      .sort({ recordedAt: 1 })
      .lean();
  }
}

export const productService = new ProductService();
