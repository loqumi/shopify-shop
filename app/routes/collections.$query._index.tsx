import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import CollectionItem from '~/components/CollectionItem';
import {COLLECTIONS_BY_QUERY} from '~/graphql/storefront/collections/CollectionsByQuery';

async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_BY_QUERY, {
      variables: {
        query: `title:${params.query}*`,
        ...paginationVariables,
      },
    }),
  ]);

  return {collections, title: params.query};
}

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
}

export default function QueryCollections() {
  const {collections, title} = useLoaderData<typeof loader>();

  return (
    <div className="px-4 lg:px-main bg-main-pink py-8">
      <h1 className="!pb-8 font-bold !text-4xl font-fraunces">{title}</h1>

      <Pagination connection={collections}>
        {({nodes, NextLink, PreviousLink, isLoading}) => (
          <div>
            <PreviousLink className="text-center">
              {isLoading ? 'Loading...' : 'Load previous collections'}
            </PreviousLink>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nodes.map((collection) => (
                <CollectionItem
                  key={collection.id}
                  handle={collection.handle}
                  imgUrl={collection.image?.url || ''}
                  description={collection.description}
                />
              ))}
            </div>
            <NextLink className="text-center">
              {isLoading ? 'Loading...' : 'Load next collections'}
            </NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}
