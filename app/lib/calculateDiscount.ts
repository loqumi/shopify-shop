export default function calculateDiscount(
  currentPrice: number,
  noDiscountPrice: number,
): number {
  if (!noDiscountPrice || !currentPrice) return 0;

  const discount = 100 - (currentPrice / noDiscountPrice) * 100;
  return Math.round(discount);
}
