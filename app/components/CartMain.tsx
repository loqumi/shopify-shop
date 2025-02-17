import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {
  CartApiQueryFragment,
  NewProductFragment,
} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import type {GetAutomaticDiscountsQuery} from '~/graphql/admin-api/types';
import React, {useEffect, useRef, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import ProductItemUpdated from '~/components/ProductItemUpdated';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  discounts?: GetAutomaticDiscountsQuery;
  recommendedProducts: NewProductFragment[];
};

type ProductNode = {
  id: string;
  handle: string;
  images: {
    nodes: Array<{
      url: string;
      width?: number | null;
      height?: number | null;
    }>;
  };
  variants: {
    nodes: Array<{id: string}>;
  };
};

export function CartMain({
  layout,
  cart: originalCart,
  discounts,
  recommendedProducts,
}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const [eligibleFreeGifts, setEligibleFreeGifts] = useState<ProductNode[][]>(
    [],
  );
  const [isGiftChosen, setIsGiftChosen] = useState<boolean>(false);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity! > 0;

  const prevEligibleFreeGiftsRef = useRef<ProductNode[][]>([]);
  useEffect(() => {
    if (cart?.lines?.nodes && cart.cost && discounts) {
      const groupedFreeGifts: ProductNode[][] = [];

      discounts.automaticDiscountNodes.nodes.forEach((discountNode) => {
        if (
          discountNode.automaticDiscount.__typename !== 'DiscountAutomaticBxgy'
        )
          return;
        const {summary, customerBuys, customerGets} =
          discountNode.automaticDiscount;
        if (!summary.toLowerCase().includes('free')) return;

        const requiredItems =
          customerBuys.items.__typename === 'DiscountProducts'
            ? customerBuys.items.products.nodes
            : [];

        const requiredAmount =
          customerBuys.value.__typename === 'DiscountPurchaseAmount' &&
          customerBuys.value?.amount;
        const requiredQuantity =
          customerBuys.value.__typename === 'DiscountQuantity' &&
          customerBuys.value?.quantity;

        let meetsRequirement = false;

        if (requiredAmount) {
          const totalCartAmount = cart.cost?.totalAmount?.amount
            ? parseFloat(cart.cost?.totalAmount?.amount)
            : 0;
          meetsRequirement = totalCartAmount >= requiredAmount;
        } else if (requiredQuantity) {
          meetsRequirement = requiredItems.every((requiredProduct) =>
            requiredProduct.variants.nodes.some((variant) => {
              const variantId = variant.id;
              const cartLine = cart.lines.nodes.find(
                (line) => line.merchandise.id === variantId,
              );
              return cartLine && cartLine.quantity >= requiredQuantity;
            }),
          );
        }

        if (
          meetsRequirement &&
          customerGets.items.__typename === 'DiscountProducts' &&
          customerGets.items.products.nodes[0]
        ) {
          groupedFreeGifts.push(customerGets.items.products.nodes);
        }
      });

      if (
        JSON.stringify(groupedFreeGifts) !==
        JSON.stringify(prevEligibleFreeGiftsRef.current)
      ) {
        setEligibleFreeGifts(groupedFreeGifts);
        prevEligibleFreeGiftsRef.current = groupedFreeGifts;
      }

      const anyGiftInCart = groupedFreeGifts
        .flat()
        .some((gift) =>
          cart.lines.nodes.some(
            (line) =>
              line.merchandise.product.id === gift.id &&
              line.cost.totalAmount.amount === '0.0',
          ),
        );
      setIsGiftChosen(anyGiftInCart);
    }
  }, [cart?.lines?.nodes, cart?.cost, discounts]);

  // Расчет баллов

  const totalAvocados = 600;
  const prevAvocados = 150;
  const newAvocados = 30;

  return (
    <div className={`${className} bg-main-pink min-h-[100vh] p-6 md:p-12`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul className={'flex flex-col gap-8'}>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>

        {eligibleFreeGifts.length > 0 && linesCount && (
          <div className="mt-4">
            <h3 className={'font-fraunces font-bold text-lg uppercase mb-4'}>
              Choose your gift
            </h3>

            <ul className="flex gap-8 rounded-xl bg-main-green !p-8 max-lg:flex-col">
              {eligibleFreeGifts.flat().map((gift) => (
                <li key={gift.id} className="flex gap-4 max-w-[300px]">
                  <img
                    className={
                      'rounded-[46%] min-w-[112px] max-w-[112px] min-h-[112px] max-h-[112px]'
                    }
                    src={gift.images.nodes[0].url}
                    alt={gift.handle}
                    width={100}
                    height={100}
                  />
                  <div className={'flex flex-col max-md:w-full'}>
                    <p className={'font-fraunces font-bold text-lg uppercase'}>
                      {gift.handle}
                    </p>
                    <AddToCartButton
                      cartPage={true}
                      isGiftChosen={isGiftChosen}
                      lines={[
                        {
                          merchandiseId: gift.variants.nodes[0].id,
                          quantity: 1,
                          selectedVariant: gift.variants.nodes[0],
                        },
                      ]}
                    >
                      {isGiftChosen ? 'Gift is chosen' : 'Choose'}
                    </AddToCartButton>
                    <p className={'font-fraunces font-bold text-lg !mt-4'}>
                      0€
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cartHasItems && (
          <>
            <CartSummary
              newAvocados={newAvocados}
              prevAvocados={prevAvocados}
              totalAvocados={totalAvocados}
              cart={cart}
              layout={layout}
            />
            <div className="max-md:hidden grid grid-cols-2 mt-12 md:grid-cols-4 gap-12">
              {recommendedProducts?.map((product) => (
                <ProductItemUpdated
                  key={product.id}
                  hasCartButton
                  handle={product.handle}
                  firstVariant={product.variants.nodes[0]}
                  title={product.title}
                  image={product.images.nodes[0].url ?? ''}
                  vendor={product.vendor}
                  currentPrice={Number(
                    product.priceRange.minVariantPrice.amount,
                  )}
                  noDiscountPrice={Number(
                    product.variants.nodes[0].compareAtPrice?.amount,
                  )}
                  currencyCode={
                    product.priceRange.minVariantPrice.currencyCode ?? 'EUR'
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div
      hidden={hidden}
      className={'flex flex-col justify-center items-center'}
    >
      <br />
      <p className={'text-center font-fraunces font-bold'}>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        className={'rounded-xl bg-dark-pink-two p-3'}
        to="/"
        prefetch="viewport"
      >
        Continue shopping
      </Link>
    </div>
  );
}
