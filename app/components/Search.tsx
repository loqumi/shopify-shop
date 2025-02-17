import {useDebounce} from 'use-debounce';
import {Image, Money} from '@shopify/hydrogen';
import {Link, useFetcher, useLoaderData} from '@remix-run/react';
import {Modal, useSearchModal} from '~/components/SearchModal';
import React, {useCallback, useEffect, useId, useState} from 'react';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import type {PredictiveSearchReturn} from '~/lib/search';
import type {loader} from '~/root';

const SearchModal = React.memo(() => {
  const data = useLoaderData<typeof loader>();
  const queriesDatalistId = useId();
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});

  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [term, setTerm] = useState('');
  const [debouncedFetch] = useDebounce(term, 400);

  interface Product {
    node: {
      id: string;
      handle: string;
      title: string;
      images: {
        edges: {
          node: {
            originalSrc: string;
            altText?: string;
          };
        }[];
      };
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: any;
        };
      };
    };
  }

  const [products, setProducts] = useState<Product[]>([]);
  const {close} = useSearchModal();

  function fetchResults(value: string) {
    fetcher.submit(
      {q: value || '', limit: 4, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }

  useEffect(() => {
    const storefrontAccessToken = data.consent.storefrontAccessToken;
    const shopifyDomain = data.consent.checkoutDomain;

    const fetchBrands = async () => {
      const query = `
        {
          products(sortKey: VENDOR, first: 4) {
            edges {
              node {
                id
                vendor
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(
          `https://${shopifyDomain}/api/2023-01/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({query}),
          },
        );

        const data: any = await response.json();
        const uniqueBrands: any = Array.from(
          new Set(
            data.data.products.edges.map((edge: any) => edge.node.vendor),
          ),
        ).slice(0, 4);
        setBrands(uniqueBrands);
      } catch (error) {}
    };

    const fetchProductTypes = async () => {
      const query = `
        {
          products(sortKey: PRODUCT_TYPE, first: 4) {
            edges {
              node {
                productType
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(
          `https://${shopifyDomain}/api/2023-01/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({query}),
          },
        );

        const data: any = await response.json();
        const uniqueProductTypes: any = Array.from(
          new Set(
            data.data.products.edges.map((edge: any) => edge.node.productType),
          ),
        ).slice(0, 4);
        setProductTypes(uniqueProductTypes);
      } catch (error) {}
    };

    const fetchProducts = async () => {
      const query = `
        {
          products(sortKey: BEST_SELLING, first: 4) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(
          `https://${shopifyDomain}/api/2023-01/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({query}),
          },
        );

        const data: any = await response.json();
        setProducts(data.data.products.edges);
      } catch (error) {}
    };

    const fetchAllData = async () => {
      await Promise.all([fetchBrands(), fetchProductTypes(), fetchProducts()]);
    };

    fetchAllData();
  }, []);

  const addQuery = useCallback((query: string) => {
    if (query.trim() === '') return;

    const storedQueries: string[] = JSON.parse(
      sessionStorage.getItem('recentQueries') || '[]',
    ) as string[];

    if (!storedQueries.includes(query)) {
      const updatedQueries = [query, ...storedQueries].slice(0, 4);
      sessionStorage.setItem('recentQueries', JSON.stringify(updatedQueries));
      setRecentQueries(updatedQueries);
    }
  }, []);

  const deleteQuery = useCallback(
    (query: string) => {
      const updatedQueries = recentQueries.filter((q) => q !== query);
      sessionStorage.setItem('recentQueries', JSON.stringify(updatedQueries));
      setRecentQueries(updatedQueries);
    },
    [recentQueries],
  );

  const handleKeyPress = useCallback(
    (event: any, goToSearch: () => void) => {
      if (event.key === 'Enter') {
        if (event.target.value === '') {
          event.preventDefault();
          return;
        }
        const inputValue = event.target.value;
        addQuery(inputValue);
        goToSearch();
      }
    },
    [addQuery],
  );

  const handleQueryClick = useCallback(
    (query: string, inputRef: React.RefObject<HTMLInputElement>) => {
      if (inputRef.current) {
        setTerm(query);
        inputRef.current.value = query;
        inputRef.current.focus();
      }
    },
    [],
  );

  useEffect(() => {
    const storedQueries: string[] = JSON.parse(
      sessionStorage.getItem('recentQueries') || '[]',
    ) as string[];
    setRecentQueries(storedQueries);
  }, []);

  useEffect(() => {
    if (debouncedFetch) {
      fetchResults(debouncedFetch);
    }
  }, [debouncedFetch]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateScreenSize();

    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const displayedProducts = isMobile
    ? products.slice(0, 2)
    : products.slice(0, 4);

  return (
    <Modal type="search">
      <div
        className={
          'bg-white w-[100vw] mt-[51px] md:mt-[164px] h-[100vh] p-6 md:p-12 pointer-events-auto'
        }
      >
        <SearchFormPredictive>
          {({goToSearch, inputRef}) => (
            <>
              <input
                className={
                  '!p-2 w-full min-h-[42px] text-lg font-bold !border-1 !border-black rounded-lg focus:outline-none'
                }
                name="q"
                type="text"
                onKeyDown={(e) => handleKeyPress(e, goToSearch)}
                onChange={(e) => setTerm(e.target.value)}
                onFocus={(e) => setTerm(e.target.value)}
                placeholder="What are we looking for?"
                value={term}
                ref={inputRef}
              />
              <div className={'flex flex-wrap mt-2 gap-4 p-1'}>
                {recentQueries.map((query, index) => {
                  const key = `button_${index}`;
                  return (
                    <div
                      key={key}
                      className={'group flex gap-1 justify-center items-center'}
                    >
                      <button
                        className={'cursor-pointer gap-1 flex'}
                        onClick={() => {
                          handleQueryClick(query, inputRef);
                        }}
                      >
                        <img src={'/clock-icon.svg'} alt={'clock'} />
                        <div
                          className={
                            'text-[#3C3C4399] duration-300 ease-linear group-hover:text-black'
                          }
                        >
                          {query}
                        </div>
                      </button>
                      <button
                        className={'cursor-pointer'}
                        onClick={() => deleteQuery(query)}
                      >
                        <img src={'/close-icon.svg'} alt={'delete'} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SearchFormPredictive>

        {!term ? (
          <>
            <div className={'gap-2 flex flex-wrap p-1'}>
              {productTypes.map((type: string) => (
                <button
                  onClick={() => setTerm(type)}
                  className={
                    'cursor-pointer duration-300 ease-linear hover:opacity-70 !text-md'
                  }
                  key={type}
                >
                  {type.toLowerCase()}
                </button>
              ))}
            </div>
            <div className={'gap-2 flex flex-wrap p-1'}>
              {brands.map((brand: string) => (
                <button
                  onClick={() => setTerm(brand)}
                  className={
                    'cursor-pointer duration-300 ease-linear hover:opacity-70 !font-black !text-md font-fraunces'
                  }
                  key={brand}
                >
                  {brand.toLowerCase()}
                </button>
              ))}
            </div>

            <h3
              className={
                '!font-black text-center !text-lg font-fraunces truncate p-3'
              }
            >
              you might want
            </h3>
            <div className="recommended-products-grid">
              {displayedProducts.map((product) => {
                return (
                  <Link
                    key={product.node.id}
                    className="flex flex-col mx-auto min-w-[140px] max-w-[240px] flex-[1]"
                    onClick={close}
                    to={`/products/${product.node.handle}`}
                  >
                    <Image
                      aspectRatio="1/1"
                      src={product.node.images.edges[0].node.originalSrc}
                      height={200}
                      width={200}
                      className={'aspect-square object-cover rounded-xl mb-4'}
                    />
                    <h4
                      className={
                        '!font-black !text-lg uppercase font-fraunces truncate'
                      }
                    >
                      {product.node.title}
                    </h4>
                    <small>
                      <Money
                        className={'font-black !text-lg font-fraunces'}
                        data={{
                          amount:
                            product.node.priceRange.minVariantPrice.amount,
                          currencyCode:
                            product.node.priceRange.minVariantPrice
                              .currencyCode,
                        }}
                      />
                    </small>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {products, queries} = items;

              if (state === 'loading' && term.current) {
                return (
                  <div
                    className={
                      '!font-black text-center !text-lg font-fraunces truncate p-6'
                    }
                  >
                    Loading...
                  </div>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    >
                      <p className={'!text-md  truncate p-2'}>
                        View all results for <q>{term.current}</q>
                        &nbsp; →
                      </p>
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        )}
      </div>
    </Modal>
  );
});

export default SearchModal;
