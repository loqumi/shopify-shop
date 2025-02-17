import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Analytics, getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import ProductItemUpdated from '~/components/ProductItemUpdated';
import {COLLECTION_QUERY} from '~/graphql/storefront/collections/CollectionProducts';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
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
  const {handle, query} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
    query,
  };
}

export default function Collection() {
  const {collection, query} = useLoaderData<typeof loader>();

  return (
    <div className="collection px-4 lg:px-main bg-main-pink py-8">
      <h1 className="!pb-8 font-bold !text-4xl font-fraunces">
        {collection.metafield?.value ?? query}
      </h1>
      <p className="collection-description">{collection.description}</p>
      <Pagination connection={collection.products}>
        {({nodes, NextLink, PreviousLink, isLoading}) => (
          <div className="flex flex-col justify-center">
            <PreviousLink className="text-center">
              {isLoading ? 'Loading...' : 'Load previous products'}
            </PreviousLink>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 gap-y-8">
              {nodes.map((product) => (
                <ProductItemUpdated
                  key={product.id}
                  handle={product.handle}
                  firstVariant={product.variants?.nodes[0]}
                  title={product.title}
                  image={product.featuredImage?.url || ''}
                  vendor={product.vendor}
                  currentPrice={
                    Number(product.variants?.nodes[0].price.amount) || 0
                  }
                  noDiscountPrice={
                    Number(product.variants?.nodes[0].compareAtPrice?.amount) ||
                    0
                  }
                  currencyCode={
                    product.variants?.nodes[0].price.currencyCode || 'EUR'
                  }
                />
              ))}
            </div>
            <NextLink className="text-center">
              {isLoading ? 'Loading...' : 'Load next products'}
            </NextLink>
          </div>
        )}
      </Pagination>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}
