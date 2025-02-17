import {useLoaderData, useSearchParams} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CustomerOrdersFragment} from 'customer-accountapi.generated';
import type {ShopifyProduct} from 'types/ShopifyProduct';
import Dropdown from '~/components/Dropdown';
import FiltersAside from '~/components/FiltersAside';
import ProductItemUpdated from '~/components/ProductItemUpdated';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {GET_HISTORY_PRODUCTS} from '~/graphql/products/HistoryProducts';
import getMaxPrice from '~/lib/getMaxPrice';
import {filterItems, sortItems} from '~/lib/orderItems';
import FiltersToggle from '~/ui/FiltersToggle';
import PrevRouteButton from '~/ui/PrevRouteButton';

export async function loader({request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 250,
  });
  const maxPrice = await getMaxPrice({
    context,
  });

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  // getting unique ids of products from orders to fetch
  const productIds = [
    ...new Set(
      data.customer.orders.nodes
        .flatMap((orders) => orders.lineItems.nodes)
        .map((lineItem) => lineItem.productId),
    ),
  ];

  const {nodes, errors: productErrors} = await context.storefront.query(
    GET_HISTORY_PRODUCTS,
    {
      variables: {
        ids: productIds,
      },
      cache: context.storefront.CacheLong(),
    },
  );

  if (productErrors?.length || !nodes) {
    throw Error('Products not found');
  }

  return json({
    maxPrice,
    products: nodes,
  });
}

const sortingOptions = [
  {
    title: 'by date',
    value: 'date',
  },
  {
    title: 'by discount',
    value: 'discount',
  },
  {
    title: 'by price: high',
    value: 'price-high',
  },
  {
    title: 'by price: low',
    value: 'price-low',
  },
];

export default function Shopping() {
  const {maxPrice, products} = useLoaderData<{
    customer: CustomerOrdersFragment;
    maxPrice: Pick<MoneyV2, 'amount' | 'currencyCode'>;
    products: ShopifyProduct[];
  }>();
  const [searchParams] = useSearchParams();

  // filter & sort params from url
  const sort = searchParams.get('sort') || 'date';
  const available = searchParams.get('available') || 'HIDE';
  const discount = searchParams.get('discount') || 'HIDE';
  const max = Number(searchParams.get('max')) || 0;
  const min = Number(searchParams.get('min')) || 0;
  const brand = searchParams.get('brand') || '';
  const productType = searchParams.get('productType') || '';

  const filteredItems = filterItems({
    items: products,
    available,
    discount,
    max,
    min,
    brand,
    productType,
  });
  const sortedItems = sortItems({items: filteredItems, sort});

  return (
    <div>
      <PrevRouteButton title="cabinet" to="/account" />

      <h1 className="!py-6 !m-0 !font-black !text-2xl font-fraunces">
        my shopping
      </h1>

      <div className="flex justify-between mb-6">
        <FiltersToggle />
        <p className="text-xs font-light hidden lg:block font-noto">
          {sortedItems.length} products
        </p>
        <Dropdown options={sortingOptions} />
      </div>

      {sortedItems.length < 1 && (
        <div className="w-full flex justify-center">No items</div>
      )}

      {sortedItems.length > 1 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 gap-y-8">
            {sortedItems.map((product) => (
              <ProductItemUpdated
                orderedBefore
                hasCartButton
                key={product.id}
                handle={product.handle}
                firstVariant={product.variants.nodes[0]}
                title={product.title}
                image={product.images.edges[0].node.url ?? ''}
                vendor={product.vendor}
                currentPrice={Number(product.variants.nodes[0].price.amount)}
                noDiscountPrice={
                  Number(product.variants.nodes[0].compareAtPrice?.amount) || 0
                }
                currencyCode={product.variants.nodes[0].price.currencyCode}
              />
            ))}
          </div>
        </div>
      )}

      <FiltersAside
        maxPrice={maxPrice}
        vendors={[...new Set(products.map((item) => item.vendor))]}
        productTypes={[...new Set(products.map((item) => item.productType))]}
      />
    </div>
  );
}
