import {Link} from '@remix-run/react';
import ProductRating from '~/ui/ProductRating';
import {AddToCartButton} from './AddToCartButton';
import DiscountIcon from '~/ui/DiscountIcon';

type Props = {
  product: NewProductFragment;
  hasCartButton?: boolean;
};

export default function ProductItem({product, hasCartButton}: Props) {
  const firstVariant = product.variants.nodes[0];
  const compareAtPrice = Number(firstVariant.compareAtPrice?.amount);
  const discount =
    100 -
    (Number(product.priceRange.minVariantPrice.amount) / compareAtPrice) * 100;

  const formattedPrice = formatPrice(
    product.priceRange.minVariantPrice.currencyCode,
    Number(product.priceRange.minVariantPrice.amount),
  );

  return (
    <Link
      className="flex flex-col min-w-[140px] flex-[1]"
      to={`/products/${product.handle}`}
      prefetch="viewport"
    >
      <div className="relative">
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && <DiscountIcon discount={Math.round(discount)} />}
          <img
            src="/lightning-icon.svg"
            alt="lightning-icon"
            className=" w-[36px]"
          />
        </div>
        <img
          src={product.images.nodes[0].url}
          alt="product-image"
          className="!aspect-square object-cover rounded-xl mb-4 w-full"
        />
        <img
          src="/round-heart-icon.svg"
          alt="heart-icon"
          className="absolute top-2 right-2"
        />
      </div>

      <ProductRating rating={3} reviewsNumber={12} />

      <h3 className="!font-black !text-lg uppercase font-fraunces truncate">
        {product.title}
      </h3>

      <p className="text-[#3C3C4399] !text-lg font-semibold lowercase">
        {product.vendor}
      </p>

      <p className="font-black !text-lg font-fraunces">{formattedPrice}</p>

      {hasCartButton && (
        <AddToCartButton
          lines={[
            {
              merchandiseId: firstVariant.id,
              quantity: 1,
              selectedVariant: firstVariant,
            },
          ]}
        >
          Add to cart
        </AddToCartButton>
      )}
    </Link>
  );
}
