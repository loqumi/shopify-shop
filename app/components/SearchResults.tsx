import React from 'react';
import {Pagination} from '@shopify/hydrogen';
import {type RegularSearchReturn} from '~/lib/search';
import ProductItemUpdated from './ProductItemUpdated';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsProducts({products}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className={'flex'}>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => (
            <div key={product.id}>
              <ProductItemUpdated
                handle={product.handle}
                firstVariant={product.variants.nodes[0]}
                title={product.title}
                image={product.variants.nodes[0]?.image?.url ?? ''}
                vendor={product.vendor}
                currentPrice={Number(product.variants.nodes[0]?.price.amount)}
                noDiscountPrice={Number(
                  product.variants.nodes[0]?.compareAtPrice?.amount,
                )}
                currencyCode={
                  product.variants.nodes[0]?.price.currencyCode ?? 'EUR'
                }
                key={product.id}
                hasCartButton
              />
            </div>
          ));

          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div
                className={'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-12'}
              >
                {ItemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}
