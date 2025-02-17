import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="absolute right-2 md:relative md:right-0">
      {compareAtPrice ? (
        <div className="!font-black uppercase !text-lg font-fraunces">
          {price ? (
            <Money
              withoutTrailingZeros
              className="!font-black uppercase !text-lg font-fraunces"
              data={price}
            />
          ) : null}
          <p>
            <Money
              withoutTrailingZeros
              className="!font-black uppercase !text-lg font-fraunces"
              data={compareAtPrice}
            />
          </p>
        </div>
      ) : price ? (
        <Money
          withoutTrailingZeros
          className="!font-black uppercase !text-lg font-fraunces"
          data={price}
        />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
