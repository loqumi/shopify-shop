import type {ShopifyProduct} from 'types/ShopifyProduct';
import calculateDiscount from './calculateDiscount';

type FilterProps = {
  items: ShopifyProduct[];
  available: string;
  discount: string;
  max: number;
  min: number;
  brand: string;
  productType: string;
};

type SortProps = {
  items: ShopifyProduct[];
  sort: string;
};

export function filterItems(props: FilterProps) {
  const {items, available, discount, max, min, brand, productType} = props;

  return items.filter((item) => {
    const selectedVariant = item.variants.nodes[0];

    const itemPrice = Number(selectedVariant.price.amount) || 0;
    const itemDiscount = calculateDiscount(
      Number(selectedVariant.price.amount),
      Number(selectedVariant.compareAtPrice?.amount),
    );
    const isAvailable = selectedVariant.availableForSale ?? false;

    // Filter by availability
    if (available === 'SHOW' && !isAvailable) return false;

    // Filter by discount
    if (discount === 'SHOW' && itemDiscount === 0) return false;

    // Filter by minimum price
    if (min > 0 && itemPrice < min) return false;

    // Filter by maximum price
    if (max > 0 && itemPrice > max) return false;

    // Filter by brand
    if (brand && item.vendor.toLowerCase() !== brand.toLowerCase())
      return false;

    // Filter by product type
    if (
      productType &&
      item.productType.toLowerCase() !== productType.toLowerCase()
    )
      return false;

    return true;
  });
}

export function sortItems(props: SortProps) {
  const {items, sort} = props;

  const itemsToSort = items.map((item) => ({
    ...item,
    price: Number(item.variants.nodes[0].price.amount) || 0,
    calculatedDiscount: calculateDiscount(
      Number(item.variants.nodes[0].price.amount),
      Number(item.variants.nodes[0].compareAtPrice?.amount),
    ),
  }));

  switch (sort) {
    case 'date':
      return itemsToSort.sort((a, b) => {
        if (!a.publishedAt || !b.publishedAt) return 0;
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });

    case 'discount':
      return itemsToSort.sort(
        (a, b) => b.calculatedDiscount - a.calculatedDiscount,
      );

    case 'price-high':
      return itemsToSort.sort((a, b) => b.price - a.price);

    case 'price-low':
      return itemsToSort.sort((a, b) => a.price - b.price);

    default:
      return itemsToSort;
  }
}
