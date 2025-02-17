import {useAsyncValue} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';

export default function RelatedProduct() {
  const relatedProduct = useAsyncValue();

  if (!relatedProduct) return;

  return (
    <div className="bg-main-pink rounded-xl p-2.5 flex gap-6">
      <img
        src={relatedProduct?.product?.images?.edges[0]?.node?.url}
        alt="related-product-image"
        className="w-[113px] h-[113px] object-cover rounded-[5px] flex-shrink-0"
      />

      <div className="flex flex-col min-w-0 justify-between w-full">
        <div className="flex justify-between text-xs sm:text-base">
          <p>Pair it with:</p>

          <AddToCartButton
            relatedProduct
            lines={[
              {
                merchandiseId: relatedProduct.product.variants.nodes[0]?.id,
                quantity: 1,
                selectedVariant: relatedProduct.product.variants.nodes[0],
              },
            ]}
          >
            <div className="flex gap-0.5 flex-wrap justify-center text-xs sm:text-base">
              <p>Add to cart -</p>
              <Money
                className="w-fit"
                data={relatedProduct?.product?.priceRange.minVariantPrice}
                withoutTrailingZeros
              />
            </div>
          </AddToCartButton>
        </div>

        <p className="font-normal text-wrap break-words line-clamp-3 text-xs sm:text-base">
          {relatedProduct?.product?.description}
        </p>
      </div>
    </div>
  );
}
