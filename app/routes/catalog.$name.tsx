import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import ProductItemUpdated from '~/components/ProductItemUpdated';
import {GET_CATEGORY_PRODUCTS} from '~/graphql/storefront/products/GetCategoryProductsQuery';
import PrevRouteButton from '~/ui/PrevRouteButton';

async function loadCriticalData({
  params,
  request,
  context,
}: LoaderFunctionArgs) {
  const {name} = params;
  const variables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const [storefrontData] = await Promise.all([
    context.storefront.query(GET_CATEGORY_PRODUCTS, {
      variables: {
        categoryName: `tag:${name}`,
        ...variables,
      },
    }),
  ]);

  if (!storefrontData) {
    throw new Response(null, {status: 404});
  }

  return {storefrontData, name};
}

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
}

export default function CatalogProducts() {
  const {name, storefrontData} = useLoaderData<typeof loader>();

  return (
    <div>
      <PrevRouteButton title="menu" to="/catalog" className="!my-10 !p-0" />

      <h1 className="!font-black !text-2xl font-fraunces !mb-2">catalogue</h1>

      <p className="font-noto text-main-gray text-sm !mb-6">{name}</p>

      <Pagination connection={storefrontData.products}>
        {({nodes, NextLink, PreviousLink, isLoading}) => (
          <div className="flex flex-col justify-center">
            <PreviousLink className="text-center">
              {isLoading ? 'Loading...' : 'Load previous products'}
            </PreviousLink>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 gap-y-8">
              {nodes.map((product) => (
                <ProductItemUpdated
                  hasCartButton
                  key={product.id}
                  handle={product.handle}
                  firstVariant={product.variants?.nodes[0]}
                  title={product.title}
                  image={product.images?.edges[0]?.node?.url || ''}
                  vendor={product.vendor}
                  currentPrice={Number(
                    product.variants?.nodes[0].price?.amount || 0,
                  )}
                  noDiscountPrice={Number(
                    product.variants?.nodes[0].compareAtPrice?.amount || 0,
                  )}
                  currencyCode={
                    product.variants?.nodes[0].price?.currencyCode || 'EUR'
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
    </div>
  );
}
