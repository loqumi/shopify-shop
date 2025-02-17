import {Link, Outlet, useLoaderData, useLocation} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import RecommendedProducts from '~/components/RecommendedProducts';
import {CATEGORIES_QUERY} from '~/graphql/admin-api/queries/categoriesQuery';
import type {TaxonomyCategory} from '~/graphql/admin-api/types';

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {admin} = context;

  const [{data}] = await Promise.all([admin.request(CATEGORIES_QUERY)]);

  if (!data) {
    throw new Response(null, {status: 404});
  }

  return {data};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

  return defer({...criticalData, ...deferredData});
}

export default function Catalog() {
  const {data, recommendedProducts} = useLoaderData<typeof loader>();
  const categories: TaxonomyCategory[] = data.shop.allProductCategoriesList;
  const location = useLocation();

  return (
    <div className="px-4 pb-14 lg:px-main">
      <div className={`${location.pathname !== '/catalog' ? 'hidden' : ''}`}>
        <h1 className="!font-black !text-2xl font-fraunces !my-10">
          catalogue
        </h1>

        <div className="flex items-start">
          <div className="flex flex-col gap-6 flex-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/catalog/${category.name}`}
                className="flex justify-between font-extrabold font-noto text-base uppercase cursor-pointer"
              >
                {category.name}

                <img
                  src="arrow-icon.svg"
                  alt="arrow-icon"
                  className="md:hidden"
                />
              </Link>
            ))}
          </div>

          <RecommendedProducts products={recommendedProducts} />
        </div>
      </div>

      <Outlet />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
