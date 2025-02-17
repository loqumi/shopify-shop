import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import React, {useEffect, useState} from 'react';
import AvocadoIcon from '~/ui/AvocadoIcon';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateScreenSize();

    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <li
      key={id}
      className="flex relative gap-4 justify-between flex-col md:flex-row"
    >
      <div className="flex flex-row gap-4">
        {image && (
          <Image
            className={'md:w-[180px] md:h-[180px] rounded-lg'}
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
          />
        )}

        <div className="flex flex-col  md:justify-center">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
          >
            <p className={'!font-black uppercase !text-lg font-fraunces'}>
              {product.title}
            </p>
          </Link>
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <p className={'text-main-gray font-noto text-lg'}>
                  {option.name}: {option.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <CartLineQuantity line={line} isMobile={isMobile} />
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({
  line,
  isMobile,
}: {
  line: CartLine;
  isMobile: boolean;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  const bonusPointsAmount = line.merchandise.product.metafield?.value;

  return (
    <div className="flex justify-between items-center md:min-w-[250px]">
      <div className="flex flex-row gap-3 p-2 md:border-2 md:border-gray-800 max-md:w-[75%] rounded-xl">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            className="text-main-gray text-4xl md:text-lg h-full max-md:p-3 max-md:border-2 text-center max-md:border-gray-800 rounded-xl"
            name="decrease-quantity"
            value={prevQuantity}
          >
            {isMobile ? (
              <img
                className={'max-w-none'}
                src={'/minus-icon.svg'}
                alt={'decrease items'}
              />
            ) : (
              <span>&#8722; </span>
            )}
          </button>
        </CartLineUpdateButton>
        <p className="text-lg flex justify-center font-bold max-md:border-2 max-md:p-2 items-center text-center max-md:border-gray-800 rounded-xl max-md:w-full">
          {quantity}
        </p>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            className="text-main-gray text-4xl max-md:p-2 md:text-lg max-md:border-2 text-center max-md:border-gray-800 rounded-xl"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            {isMobile ? (
              <img
                className={'max-w-none'}
                src={'/mobile-plus-icon.svg'}
                alt={'add more'}
              />
            ) : (
              <span className={'text-center'}>&#43;</span>
            )}
          </button>
        </CartLineUpdateButton>
      </div>
      <div
        className={
          'flex flex-col items-center absolute right-2 md:relative md:right-0 justify-center h-full'
        }
      >
        <ProductPrice price={line?.cost?.totalAmount} />
        {bonusPointsAmount && (
          <div
            className={
              'flex absolute max-md:bottom-[40px] max-md:right-0 bottom-[20%] font-noto h-[33px] font-semibold bg-main-green p-2 items-center rounded-full'
            }
          >
            +{bonusPointsAmount}&nbsp;
            <AvocadoIcon color={'pink'} />
          </div>
        )}
      </div>
      <CartLineRemoveButton
        lineIds={[lineId]}
        disabled={!!isOptimistic}
        isMobile={isMobile}
      />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
  isMobile,
}: {
  lineIds: string[];
  disabled: boolean;
  isMobile: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="flex absolute w-[24px] top-0 right-2 md:right-0 md:relative top-unset justify-center absolute"
      >
        {isMobile ? (
          <img src="/mobile-close-icon.svg" alt="remove button" />
        ) : (
          <img src="/close-button.svg" alt="remove button" />
        )}
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
