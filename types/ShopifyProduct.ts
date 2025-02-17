interface Image {
  altText: string | null;
  height: number;
  id: string;
  url: string;
  width: number;
}

interface Price {
  amount: string;
  currencyCode: string;
}

interface ProductBasic {
  handle: string;
  title: string;
}

interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  availableForSale: boolean;
  compareAtPrice: {amount: string; currencyCode: string} | null;
  id: string;
  image: Image;
  price: Price;
  product: ProductBasic;
  selectedOptions: SelectedOption[];
  sku: string;
  title: string;
  unitPrice: number | null;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface SEO {
  description: string | null;
  title: string | null;
}

interface ImageEdge {
  node: {
    id: string;
    url: string;
  };
}

export interface ShopifyProduct {
  description: string;
  descriptionHtml: string;
  handle: string;
  id: string;
  images: {
    edges: ImageEdge[];
  };
  options: ProductOption[];
  productType: string;
  publishedAt: string;
  selectedVariant?: ProductVariant;
  seo: SEO;
  title: string;
  variants: {
    nodes: ProductVariant[];
  };
  vendor: string;
}
