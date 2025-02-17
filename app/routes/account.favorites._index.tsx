import {defer, useLoaderData, useSearchParams} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useContext} from 'react';
import Dropdown from '~/components/Dropdown';
import FiltersAside from '~/components/FiltersAside';
import ProductItemUpdated from '~/components/ProductItemUpdated';
import getMaxPrice from '~/lib/getMaxPrice';
import {filterItems, sortItems} from '~/lib/orderItems';
import type {WishlistContextType} from '~/lib/WishlistContext';
import {WishlistContext} from '~/lib/WishlistContext';
import FiltersToggle from '~/ui/FiltersToggle';
import PrevRouteButton from '~/ui/PrevRouteButton';

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

export async function loader({context}: LoaderFunctionArgs) {
  const maxPrice = await getMaxPrice({
    context,
  });
  return defer({maxPrice});
}

export default function Favorites() {
  const {maxPrice} = useLoaderData<typeof loader>();
  const {wishlistItems} = useContext(WishlistContext) as WishlistContextType;
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
    items: wishlistItems,
    available,
    discount,
    max,
    min,
    brand,
    productType,
  });
  const sortedWishlistItems = sortItems({items: filteredItems, sort});

  return (
    <div>
      <PrevRouteButton title="cabinet" to="/account" />

      <h1 className="!py-6 !m-0 !font-black !text-2xl font-fraunces">
        favorites
      </h1>

      <div className="flex justify-between mb-6">
        <FiltersToggle />
        <p className="text-xs font-light hidden lg:block font-noto">
          {sortedWishlistItems.length} products
        </p>
        <Dropdown options={sortingOptions} />
      </div>

      {sortedWishlistItems.length < 1 && (
        <div className="w-full flex justify-center">No items in favorites</div>
      )}

      {sortedWishlistItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 gap-y-8">
          {sortedWishlistItems.map((product) => (
            <ProductItemUpdated
              handle={product.handle}
              firstVariant={product.variants.nodes[0]}
              title={product.title}
              image={product.selectedVariant?.image?.url ?? ''}
              vendor={product.vendor}
              currentPrice={Number(product.selectedVariant?.price.amount)}
              noDiscountPrice={Number(
                product.selectedVariant?.compareAtPrice?.amount,
              )}
              currencyCode={
                product.selectedVariant?.price.currencyCode ?? 'EUR'
              }
              key={product.id}
              hasCartButton
            />
          ))}
        </div>
      )}

      <FiltersAside
        maxPrice={maxPrice}
        vendors={[...new Set(wishlistItems.map((item) => item.vendor))]}
        productTypes={[
          ...new Set(wishlistItems.map((item) => item.productType)),
        ]}
      />
    </div>
  );
}
