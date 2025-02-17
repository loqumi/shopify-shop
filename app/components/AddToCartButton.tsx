import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import React from 'react';
import {useCartProduct} from '~/components/CartContext';

type Props = {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  productPage?: boolean;
  isGiftChosen?: boolean;
  cartPage?: boolean;
  relatedProduct?: boolean;
};

export function AddToCartButton(props: Props) {
  const {
    analytics,
    children,
    disabled,
    lines,
    productPage,
    isGiftChosen,
    cartPage,
    relatedProduct,
  } = props;
  const {setCartLines} = useCartProduct();

  const baseClasses =
    'rounded-[10px] font-noto !p-2.5 cursor-pointer h-11 flex justify-center items-center text-lg !font-semibold';

  // Priority styles for related products
  const relatedProductClasses = relatedProduct
    ? '!border-2 text-base !font-medium !mt-0'
    : '';

  // Conditional styles based on page type, applied only if not a related product
  const productPageClasses =
    !relatedProduct && productPage
      ? '!mt-0 bg-dark-pink-two text-white w-full'
      : !relatedProduct
      ? '!mt-5 !border !border-black w-[118px] md:w-full'
      : '';

  const cartPageClasses = !relatedProduct && cartPage ? '!w-full' : '';

  // Combine all classes
  const buttonClassName = `${baseClasses} ${relatedProductClasses} ${productPageClasses} ${cartPageClasses}`;

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={(e) => {
              setCartLines(lines);
              e.stopPropagation();
            }}
            className={buttonClassName}
            disabled={(disabled ?? fetcher.state !== 'idle') || isGiftChosen}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
