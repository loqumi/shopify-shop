import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {BLOGS_QUERY} from '~/graphql/blogs/BlogsQuery';
import {NEW_PRODUCTS_QUERY} from '~/graphql/storefront/products/NewProductsQuery';
import {STORIES_COLLECTIONS_QUERY} from '~/graphql/storefront/collections/StoriesCollectionsQuery';
import {VIDEO_COLLECTION_QUERY} from '~/graphql/storefront/collections/VideoCollectionQuery';
import Blogs from '~/sections/Blogs';
import Categories from '~/sections/Categories';
import CurrentPromotions from '~/sections/CurrentPromotions';
import NewProducts from '~/sections/NewProducts';
import ProgressBarSwiper from '~/sections/ProgressBarSwiper';
import Selections from '~/sections/Selections';
import Ticker from '~/sections/Ticker';
import {PROMOTIONS_COLLECTIONS_QUERY} from '~/graphql/storefront/collections/PromotionsCollectionsQuery';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [
    {products},
    {collections: promotionsCollections},
    {blogs},
    {collections: storiesCollection},
    {collection: videoCollection},
  ] = await Promise.all([
    // context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(NEW_PRODUCTS_QUERY, {
      variables: {
        first: 10,
      },
    }),

    context.storefront.query(PROMOTIONS_COLLECTIONS_QUERY),

    context.storefront.query(BLOGS_QUERY, {
      variables: paginationVariables,
    }),

    context.storefront.query(STORIES_COLLECTIONS_QUERY),

    context.storefront.query(VIDEO_COLLECTION_QUERY),
  ]);

  return {
    promotionsCollections: promotionsCollections.nodes,
    newProducts: products.nodes,
    blogs: blogs.nodes,
    storiesCollection: storiesCollection.nodes,
    videoCollection,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <ProgressBarSwiper collections={data.storiesCollection} />
      <Ticker />
      <Categories />
      <NewProducts products={data.newProducts} />
      <CurrentPromotions
        promotions={data.promotionsCollections}
        featuredProducts={data.newProducts}
      />
      {data.videoCollection && <Selections collection={data.videoCollection} />}
      <Blogs blogs={data.blogs} />
    </div>
  );
}
