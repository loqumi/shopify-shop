import {
  Await,
  type MetaFunction,
  useLoaderData,
  useRouteLoaderData,
} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import type {RootLoader} from '~/root';
import {
  json,
  defer,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {DISCOUNTS_QUERY} from '~/graphql/admin-api/queries/discountsQuery';
import type {GetAutomaticDiscountsQuery} from '~/graphql/admin-api/types';
import {NEW_PRODUCTS_QUERY} from '~/graphql/storefront/products/NewProductsQuery';
import {CUSTOMER_POINTS_QUERY} from '~/graphql/customer-account/CustomerPointsQuery';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {admin, customerAccount} = context;

  const [{data: discounts}, {products}, customer] = await Promise.all([
    admin.request<GetAutomaticDiscountsQuery>(DISCOUNTS_QUERY),

    context.storefront.query(NEW_PRODUCTS_QUERY, {
      variables: {
        first: 4,
      },
    }),

    customerAccount
      .isLoggedIn()
      .then((loggedIn) =>
        loggedIn ? customerAccount.query(CUSTOMER_POINTS_QUERY) : null,
      ),
  ]);

  return {discounts, recommendedProducts: products.nodes, customer};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {discounts, recommendedProducts, customer} =
    useLoaderData<typeof loader>();
  if (!rootData) return null;

  return (
    <div className="cart">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await
          resolve={rootData.cart}
          errorElement={<div>An error occurred</div>}
        >
          {(cart) => {
            return (
              <CartMain
                layout="page"
                cart={cart}
                recommendedProducts={recommendedProducts}
                discounts={discounts as GetAutomaticDiscountsQuery}
                customer={customer?.data.customer}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
