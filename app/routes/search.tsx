import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  defer,
} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {Aside, useAside} from '~/components/Aside';
import {FiltersMain} from '~/components/FiltersMain';
import {useSearchModal} from '~/components/SearchModal';
import {SearchResults} from '~/components/SearchResults';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/20/solid';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
  type MaxPriceReturn,
} from '~/lib/search';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {useSearchParamsState} from '~/hooks/useSearchParamsState';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const maxPrice = await getMaxPrice({
    context,
  });
  const searchPromise = await (isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context}));

  return defer({...searchPromise, maxPrice});
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const {type, term, result, error, maxPrice} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const {open: openModal} = useSearchModal();
  const {open} = useAside();

  const [sortKey] = useSearchParamsState<StorefrontAPI.SearchSortKeys>(
    'sortKey',
    'RELEVANCE',
    'string',
  );

  const handleChangeSortKey = (value: StorefrontAPI.SearchSortKeys) => {
    const params = new URLSearchParams(window.location.search);

    params.delete('direction');
    params.delete('cursor');
    params.delete('sortKey');

    navigate(
      `${window.location.pathname}?${params.toString()}&sortKey=${value}`,
    );
  };

  if (type === 'predictive') return null;

  const vendors: string[] =
    result?.items?.products?.nodes?.map((product) => product.vendor) || [];

  const uniqueVendors: string[] = Array.from(new Set(vendors));

  const productTypes: string[] =
    result?.items?.products?.nodes?.map((product) => product.productType) || [];

  const uniqueProductTypes: string[] = Array.from(new Set(productTypes));

  return (
    <div className={'min-h-[100vh] p-2 md:p-10 text-center'}>
      <button
        className={'!font-semibold text-lg'}
        onClick={() => openModal('search')}
      >
        {term}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({products, term}) => (
            <div>
              <div className={'flex justify-between pb-6 flex justify-center'}>
                <button
                  className={'flex gap-4 absolute left-4 md:left-16'}
                  onClick={() => open('filters')}
                >
                  <img src={'/filters.svg'} alt={'filters'} />
                  <p>filters</p>
                </button>
                <p className={'text-md'}>products</p>
                <Listbox value={sortKey} onChange={handleChangeSortKey}>
                  <div className="absolute right-4 md:right-16">
                    <ListboxButton className="relative flex justify-between w-full cursor-default rounded-md bg-white  text-left text-gray-900 focus:outline-none sm:text-sm">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate lowercase">
                          {sortKey}
                        </span>
                      </span>
                      <span className="pointer-events-none inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <img src={'/filter-arrow.svg'} alt={'arrow-down'} />
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      anchor={{to: 'bottom start', gap: '4px'}}
                      transition
                      className="absolute z-10 mt-1 max-h-56 rounded-md bg-[#D5E882] py-1 text-base shadow-lg sm:text-sm"
                    >
                      <ListboxOption
                        value={'PRICE'}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-black data-[focus]:text-white"
                      >
                        <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                          by price
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-black group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                          <CheckIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      </ListboxOption>
                      <ListboxOption
                        value={'RELEVANCE'}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-black data-[focus]:text-white"
                      >
                        <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                          by relevance
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-black group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                          <CheckIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              <div>
                <SearchResults.Products products={products} term={term} />
              </div>
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
      <FiltersAside
        maxPrice={maxPrice}
        vendors={uniqueVendors}
        productTypes={uniqueProductTypes}
      />
    </div>
  );
}

interface FiltersAsideProps {
  vendors: string[];
  productTypes: string[];
  maxPrice: {amount: string; currencyCode: string};
}

function FiltersAside({vendors, productTypes, maxPrice}: FiltersAsideProps) {
  return (
    <Aside type="filters" heading="filters">
      <FiltersMain
        maxPrice={maxPrice}
        vendors={vendors}
        productTypes={productTypes}
      />
    </Aside>
  );
}

const NEW_PRODUCT_VARIANT_FRAGMENT = `#graphql
fragment NewProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
        amount
        currencyCode
    }
    id
    image {
        __typename
        id
        url
        altText
        width
        height
    }
    price {
        amount
        currencyCode
    }
    product {
        title
        handle
    }
    selectedOptions {
        name
        value
    }
    sku
    title
    unitPrice {
        amount
        currencyCode
    }
}
` as const;

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
      __typename
      id
      title
      vendor
      handle
      descriptionHtml
      description
      trackingParameters
      productType
      options {
          name
          values
      }
      variants(first: 1) {
          nodes {
              ...NewProductVariant
          }
      }
      seo {
          description
          title
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
      priceRange {
          minVariantPrice {
              amount
              currencyCode
          }
      }
  }
${NEW_PRODUCT_VARIANT_FRAGMENT}
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

const MAX_PRICE_QUERY = `#graphql
  query maxPrice {
    products(sortKey: PRICE, first: 1, reverse: true) {
      edges {
        node {
          id
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
    $available: SearchUnavailableProductsType = HIDE
    $min: Float, 
    $max: Float,
    $sortKey: SearchSortKeys = RELEVANCE
  ) @inContext(country: $country, language: $language) {
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: $sortKey,
      types: [PRODUCT],
      unavailableProducts: $available,
        productFilters: {
            price: { max: $max, min: $min }
        }
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function regularSearch({
  request,
  context,
}: Pick<
  LoaderFunctionArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');
  const available = String(
    url.searchParams.get('available') || 'HIDE',
  ) as StorefrontAPI.SearchUnavailableProductsType;
  const max = Number(url.searchParams.get('max') || 100);
  const min = Number(url.searchParams.get('min') || 0);
  const sortKey = String(
    url.searchParams.get('sortKey') || 'RELEVANCE',
  ) as StorefrontAPI.SearchSortKeys;
  const discount = String(url.searchParams.get('discount') || 'HIDE');
  const brand = String(url.searchParams.get('brand') || '');
  const productType = String(url.searchParams.get('productType') || '');

  const queryParts = [
    `(product_type:${term}* OR title:${term}* OR vendor:${term}*)`,
  ];

  if (discount === 'SHOW') {
    queryParts.push('tag:discount');
  }
  if (brand) {
    queryParts.push(`vendor:${brand}`);
  }
  if (productType) {
    queryParts.push(`product_type:${productType}`);
  }

  const query = `(${queryParts.join(' AND ')})`;

  // Search articles, pages, and products for the `q` term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term: query,
      available,
      max,
      min,
      sortKey,
    },
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
fragment PredictiveProduct on Product {
    __typename
    id
    title
    vendor
    handle
    descriptionHtml
    description
    trackingParameters
    options {
        name
        values
    }
    variants(first: 1) {
        nodes {
            ...NewProductVariant
        }
    }
    seo {
        description
        title
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
    priceRange {
        minVariantPrice {
            amount
            currencyCode
        }
    }
}
${NEW_PRODUCT_VARIANT_FRAGMENT}
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  ActionFunctionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

async function getMaxPrice({
  context,
}: Pick<ActionFunctionArgs, 'context'>): Promise<MaxPriceReturn> {
  const {storefront} = context;

  const {products, errors} = await storefront.query(MAX_PRICE_QUERY);

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!products?.edges?.length) {
    throw new Error('No products data returned from Shopify API');
  }
  const [{node}] = products.edges;

  return node.priceRange.maxVariantPrice;
}
