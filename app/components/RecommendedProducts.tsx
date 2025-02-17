import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Await, Link} from '@remix-run/react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export default function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products flex-1 hidden md:block">
      <h2 className="uppercase font-fraunces !mb-9">We recommend</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div>
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        className="rounded-xl"
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4 className="!font-black !text-lg uppercase font-fraunces truncate !m-0 !mt-5">
                        {product.title}
                      </h4>

                      <p className="text-[#3C3C4399] !text-lg font-semibold lowercase font-noto">
                        {product.vendor}
                      </p>

                      <small>
                        <Money
                          className="font-black !text-lg font-fraunces"
                          data={product.priceRange.minVariantPrice}
                        />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}
