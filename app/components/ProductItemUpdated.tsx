import {Link} from '@remix-run/react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import ProductRating from '~/ui/ProductRating';
import {AddToCartButton} from './AddToCartButton';
import DiscountIcon from '~/ui/DiscountIcon';
import calculateDiscount from '~/lib/calculateDiscount';
import type {ProductVariant} from 'types/ShopifyProduct';

type Props = {
  hasCartButton?: boolean;
  handle: string;
  firstVariant: ProductVariant | ProductVariantFragment;
  title: string;
  image: string;
  vendor: string;
  currentPrice: number;
  noDiscountPrice: number;
  currencyCode: string;
  orderedBefore?: boolean;
};

export default function ProductItemUpdated(props: Props) {
  const {
    handle,
    vendor,
    image,
    title,
    firstVariant,
    hasCartButton,
    currencyCode,
    currentPrice,
    noDiscountPrice,
    orderedBefore,
  } = props;
  const discount = calculateDiscount(currentPrice, noDiscountPrice);

  return (
    <div className="flex flex-col min-w-[140px] flex-[1]">
      <div className="relative">
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && <DiscountIcon discount={Math.round(discount)} />}
          <img
            src="/lightning-icon.svg"
            alt="lightning-icon"
            className=" w-[36px]"
          />
        </div>
        <Link to={`/products/${handle}`} prefetch="viewport">
          <img
            src={image}
            alt="product-image"
            className="!aspect-square object-cover rounded-xl mb-4 w-full"
          />
        </Link>
        <img
          src="/round-heart-icon.svg"
          alt="heart-icon"
          className="absolute top-2 right-2"
        />
      </div>

      <ProductRating rating={3} reviewsNumber={12} />

      <h3 className="!font-black !text-lg uppercase font-fraunces truncate">
        {title}
      </h3>

      <p className="text-[#3C3C4399] !text-lg font-semibold lowercase font-noto">
        {vendor}
      </p>

      <p className="font-black !text-lg font-fraunces">
        {currentPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: currencyCode,
          maximumFractionDigits: 0,
        })}
      </p>

      {hasCartButton && (
        <AddToCartButton
          lines={[
            {
              merchandiseId: firstVariant?.id,
              quantity: 1,
              selectedVariant: firstVariant,
            },
          ]}
        >
          {orderedBefore ? 'Order again' : 'Add to cart'}
        </AddToCartButton>
      )}
    </div>
  );
}
