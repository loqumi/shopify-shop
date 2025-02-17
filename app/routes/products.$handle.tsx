import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Analytics,
  getSelectedProductOptions,
  Money,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductForm} from '~/components/ProductForm';
import {WishlistToggle} from '~/components/WishlistToggle';
import {getVariantUrl} from '~/lib/variants';
import ProductRating from '~/ui/ProductRating';
import Collapsible from 'react-collapsible';
import CollapsibleTrigger from '~/ui/CollapsibleTrigger';
import RelatedProduct from '~/components/RelatedProduct';
import ProductImageViewer from '~/components/ProductImageViewer';
import type {GetProductCategoriesQuery} from '~/graphql/admin-api/types';
import {PRODUCT_QUERY, VARIANTS_QUERY} from '~/graphql/products/ProductQuery';
import {PRODUCTS_QUERY} from '~/graphql/admin-api/queries/productsQuery';
import {RELATED_PRODUCT_QUERY} from '~/graphql/products/RelatedProductQuery';
import CardItem from '~/components/CardItem';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront, admin} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, adminData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
    admin.request<GetProductCategoriesQuery>(PRODUCTS_QUERY, {
      variables: {
        handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  const productMetafields = Object.fromEntries(
    product.metafields.map((item) => {
      const key = item?.key === null ? '' : item?.key;
      return [key, item?.value];
    }),
  );

  return {
    product,
    adminProduct: adminData.data,
    productMetafields,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const relatedProduct = context.storefront
    .query(
      `#graphql
      query ProductId(
      $handle: String!
    ) {
      product(handle: $handle) {
        id
        metafield(
          key: "related_products"
          namespace: "shopify--discovery--product_recommendation"
        ) {
          id
          value
        }
      }
    }
  `,
      {
        variables: {handle: params.handle!},
      },
    )
    .then(async ({product}) => {
      if (!product?.metafield?.value) return null;
      // Parse the metafield value to get the related product ID
      const relatedProductId: string = JSON.parse(product.metafield.value)[0];

      // Fetch the related product details
      return context.storefront.query(RELATED_PRODUCT_QUERY, {
        variables: {
          productId: relatedProductId,
        },
      });
    })
    .catch((error) => {
      console.error('Error fetching related product:', error);
      return null;
    });

  return {
    variants,
    relatedProduct,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductItemFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, adminProduct, relatedProduct, productMetafields} =
    useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {title, description, images, productType} = product;

  return (
    <div className="px-4 md:flex lg:px-[10%] md:mt-6 lg:mt-20 md:gap-6 lg:gap-[10%] mb-12">
      <p className="font-normal text-sm text-[#3C3C4399] !my-1 md:hidden">
        {adminProduct?.productByHandle?.category?.fullName.replaceAll('>', '/')}
      </p>

      {productType === 'gift card' ? (
        <CardItem
          amount={Number(product.selectedVariant?.price.amount)}
          handle={product.handle}
        />
      ) : (
        <ProductImageViewer images={images.edges} />
      )}

      <div className="product-main flex-1 ">
        <p className="font-normal text-sm text-[#3C3C4399] hidden md:block">
          {adminProduct?.productByHandle?.category?.fullName.replaceAll(
            '>',
            '/',
          )}
        </p>

        <div className="flex justify-between mb-3 items-end">
          <h1 className="!font-fraunces uppercase !mb-0 !mt-6 !text-lg !font-black">
            {title}
          </h1>
          <Money
            className="font-black !text-lg font-fraunces"
            data={selectedVariant.price}
            withoutTrailingZeros
          />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-normal text-[#3C3C4399]">{`50ml / brief description of the product`}</p>
            <ProductRating rating={3} reviewsNumber={12} productPage />
          </div>

          <WishlistToggle product={product} />
        </div>

        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data?.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>

        <br />

        <Collapsible trigger={<CollapsibleTrigger title="details" />}>
          <p className="text-main-gray">{description}</p>
        </Collapsible>

        <Collapsible trigger={<CollapsibleTrigger title="ingredients" />}>
          <p className="text-main-gray whitespace-pre-line">
            {productMetafields.ingredients}
          </p>
        </Collapsible>

        <Collapsible trigger={<CollapsibleTrigger title="how to use" />}>
          <p className="text-main-gray whitespace-pre-line">
            {productMetafields.how_to_use}
          </p>
        </Collapsible>

        <br />

        <Suspense fallback={<div>...loading</div>}>
          <Await resolve={relatedProduct}>
            <RelatedProduct />
          </Await>
        </Suspense>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
