import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ReactNode} from 'react';

// Product Image Type
export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// Minimal Variant Price Type
export interface MinVariantPrice {
  amount: string;
  currencyCode: CurrencyCode | undefined;
}

// Recommended Product Type
export interface RecommendedProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  priceRange: {
    minVariantPrice: MinVariantPrice;
  };
  images: {
    nodes: ProductImage[];
  };
}

// Response Type for Recommended Products Query
export interface RecommendedProductsResponse {
  products: {
    nodes: RecommendedProduct[];
  };
}

// Variables Type for Recommended Products Query
export interface RecommendedProductsVariables {
  country?: string; // CountryCode
  language?: string; // LanguageCode
}

// Props Type for RecommendedProducts Component
export interface RecommendedProductsProps {
  products: Promise<RecommendedProductsResponse>;
}
