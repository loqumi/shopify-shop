import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {MaxPriceReturn} from './search';

export default async function getMaxPrice({
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
