import type {
  NewProductFragment,
  PromotionsCollectionFragment,
} from 'storefrontapi.generated';
import CurrentPromotionCard from '~/components/CurrentPromotionCard';
import {Link} from '@remix-run/react';
import ProductItemUpdated from '~/components/ProductItemUpdated';

type Props = {
  promotions: PromotionsCollectionFragment[];
  featuredProducts: NewProductFragment[];
};

export default function CurrentPromotions({
  promotions,
  featuredProducts,
}: Props) {
  return (
    <div className="mb-12 pt-12 md:pt-20 px-4 lg:px-main">
      <div className="flex justify-between lg:!block text-center mb-6 relative">
        <h1 className="!font-bold !text-2xl font-fraunces">
          current promotions
        </h1>

        <Link
          className="flex items-center gap-2.5 absolute right-0 top-0 h-full"
          to="/collections"
        >
          <p className="!font-bold lg:hidden">more</p>
          <p className="!font-bold hidden lg:block uppercase">all promotions</p>
          <img src="/arrow-icon.svg" alt="arrow-icon" className="!h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 pb-3 lg:pb-8">
        {promotions.slice(0, 3).map((promotion) => (
          <CurrentPromotionCard promotion={promotion} key={promotion.id} />
        ))}
      </div>

      {/* grid */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <CurrentPromotionCard promotion={promotions[0]} />

        <div className="hidden gap-6 lg:flex">
          {featuredProducts.slice(0, 2).map((product) => (
            <ProductItemUpdated
              key={product.id}
              handle={product.handle}
              firstVariant={product.variants.nodes[0]}
              title={product.title}
              image={product.images.nodes[0]?.url ?? ''}
              vendor={product.vendor}
              currentPrice={Number(product.priceRange.minVariantPrice.amount)}
              noDiscountPrice={Number(
                product.variants.nodes[0].compareAtPrice?.amount,
              )}
              currencyCode={
                product.priceRange.minVariantPrice.currencyCode ?? 'EUR'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
