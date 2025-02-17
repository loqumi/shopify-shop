import {Link} from '@remix-run/react';
import {ExternalVideo} from '@shopify/hydrogen';
import type {VideoCollectionFragment} from 'storefrontapi.generated';
import ProductItemUpdated from '~/components/ProductItemUpdated';
import {MediaHost} from '~/graphql/admin-api/types';
import ArrowButton from '~/ui/ArrowButton';

export default function Selections({
  collection,
}: {
  collection: VideoCollectionFragment;
}) {
  const externalVideoData = {
    host: MediaHost.Youtube,
    embedUrl: collection.description,
    MediaContentType: 'EXTERNAL_VIDEO',
    // id: 'wDchsz8nmbo?si=rftL5r3HN9yfWQls',
    // originUrl: 'https://www.youtube.com/watch?v=wDchsz8nmbo',
  };

  return (
    <div className="bg-dark-pink pt-12 relative pb-12">
      <h1 className="text-[#D5E882] !font-bold uppercase !text-2xl md:!text-6xl !px-4 lg:!px-main md:!pb-6 md:text-center">
        <span className="bg-[#D5E882] text-dark-pink px-1">Selections</span>{' '}
        from{' '}
      </h1>
      <h1 className="text-[#D5E882] !font-bold uppercase !text-2xl md:!text-6xl !px-4 md:!px-main !pb-6 md:text-center">
        the{' '}
        <span className="bg-[#D5E882] text-dark-pink px-1">pink avocado</span>{' '}
        team
      </h1>

      <div className="md:flex md:justify-center md:!px-main">
        <ExternalVideo
          data={externalVideoData}
          className="w-full aspect-video"
        />
      </div>

      <div className="flex justify-between py-6 !px-4 md:!px-main">
        <div className="flex gap-2 invisible md:visible">
          <ArrowButton left />
          <ArrowButton />
        </div>

        <Link
          className="flex items-center gap-2.5"
          to="/collections/selections"
        >
          <p className="!font-bold bg-[#D5E882] text-dark-pink !text-base !px-1">
            all selections
          </p>
          <img src="/arrow-icon.svg" alt="arrow-icon" className="!h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col md:!flex-row md:!px-main">
        <div className="flex justify-end gap-2 items-end pb-6 !px-4 md:items-start md:!px-0 relative">
          <img
            src="/green-arrow.svg"
            alt="green-arrow"
            className="md:!hidden"
          />
          <img
            src="/green-down-arrow.svg"
            alt=""
            className="absolute top-[50px] !hidden md:!block"
          />
          <h1 className="!font-bold uppercase text-white !text-2xl flex flex-col md:items-end">
            materials
            <span className="">from</span>
            <span>video</span>
          </h1>
        </div>

        <div className="flex gap-4 overflow-x-scroll !px-4">
          {collection.products.nodes.map((node) => (
            <ProductItemUpdated
              key={node.id}
              hasCartButton
              handle={node.handle}
              firstVariant={node.variants?.nodes[0]}
              title={node.title}
              image={node.images?.edges[0]?.node.url ?? ''}
              vendor={node.vendor}
              currentPrice={Number(node.variants?.nodes[0].price.amount)}
              noDiscountPrice={Number(
                node.variants?.nodes[0]?.compareAtPrice?.amount,
              )}
              currencyCode={node.variants?.nodes[0].price.currencyCode ?? 'EUR'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
