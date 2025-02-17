import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import React, {useRef, useState} from 'react';
import {type FetcherWithComponents, Link} from '@remix-run/react';
import {CartProgressBar} from '~/components/CartProgressBar';
import AvocadoIcon from '~/ui/AvocadoIcon';
import ProductItem from '~/components/ProductItem';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
  totalAvocados: number;
  prevAvocados: number;
  newAvocados: number;
};

export function CartSummary({
  cart,
  layout,
  prevAvocados,
  totalAvocados,
  newAvocados,
}: CartSummaryProps) {
  const [promocode, setPromocode] = useState('');
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <>
      <div
        aria-labelledby="cart-summary"
        className={`${className} flex gap-8 mt-12 mb-12 justify-between max-md:flex-col`}
      >
        <CartDiscounts
          promocode={promocode}
          setPromocode={setPromocode}
          discountCodes={cart.discountCodes}
        />
        <div
          className={
            'flex justify-between max-lg:w-[100%] w-[50%] gap-4 max-md:w-full max-md:flex-col max-md:items-end'
          }
        >
          <dl className="flex justify-between w-[50%]">
            <dt className={'text-main-gray font-noto text-lg'}>Amount due:</dt>
            <dd>
              {cart.cost?.subtotalAmount?.amount ? (
                <div>
                  <Money
                    withoutTrailingZeros
                    className={
                      '!font-black uppercase !text-lg font-fraunces text-end'
                    }
                    data={cart.cost?.subtotalAmount}
                  />
                  {newAvocados && (
                    <div
                      className={
                        'max-md:flex hidden flex font-noto h-[33px] font-semibold bg-main-green p-2 items-center rounded-full'
                      }
                    >
                      +{newAvocados}&nbsp;
                      <AvocadoIcon color={'pink'} />
                    </div>
                  )}
                </div>
              ) : (
                '-'
              )}
            </dd>
          </dl>
          <CartCheckoutActions
            newAvocados={newAvocados}
            checkoutUrl={cart.checkoutUrl}
          />
        </div>
      </div>
      <CartProgressBar
        totalAvocados={totalAvocados}
        prevAvocados={prevAvocados}
        newAvocados={newAvocados}
      />
    </>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  newAvocados,
}: {
  checkoutUrl?: string;
  newAvocados?: number;
}) {
  if (!checkoutUrl) return null;

  return (
    <div className={'flex w-full gap-4 justify-between items-center'}>
      <Link
        className={
          'bg-dark-pink-two !text-main-green w-full max-md:w-full h-[46px] flex justify-center items-center text-center p-2 rounded-lg'
        }
        to={checkoutUrl}
        target="_self"
      >
        <p>Checkout</p>
      </Link>
      {newAvocados && (
        <div
          className={
            'max-md:hidden flex font-noto h-[33px] font-semibold bg-main-green p-2 items-center rounded-full'
          }
        >
          +{newAvocados}&nbsp;
          <AvocadoIcon color={'pink'} />
        </div>
      )}
    </div>
  );
}

function CartDiscounts({
  promocode,
  setPromocode,
  discountCodes,
}: {
  promocode: string;
  setPromocode: (promocode: string) => void;
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="w-[40%] max-md:w-full">
      {/* Have existing discount, display it with a remove option */}
      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-4 h-[46px]">
          <input
            className={
              'w-full !mb-0 !mt-0 px-2 rounded-md focus:outline-none !border-dotted'
            }
            type="text"
            name="discountCode"
            onChange={(e) => setPromocode(e.target.value)}
            placeholder="Discount code"
          />
          {promocode && (
            <button
              className={
                'bg-dark-pink-two !text-main-green w-[25%] text-center p-2 rounded-lg'
              }
              type="submit"
            >
              Apply
            </button>
          )}
        </div>
      </UpdateDiscountForm>
      <dl hidden={!codes.length}>
        <div className="flex gap-4 items-center">
          <dt>Discounts</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              <button>
                <img src={'/close-icon.svg'} alt={'delete discount'} />
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code) saveAppliedCode && saveAppliedCode(code as string);
        return children;
      }}
    </CartForm>
  );
}
