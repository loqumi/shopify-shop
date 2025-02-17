import {Link} from '@remix-run/react';
import type {StoriesCollectionFragment} from 'storefrontapi.generated';

type Props = {
  collection: StoriesCollectionFragment;
};

export default function StorySlide({collection}: Props) {
  return (
    <div className="!h-full !w-full flex items-end justify-center bg-gray-100 relative px-4 pb-8 md:justify-end md:px-[10%]">
      <img
        src={collection.image?.url}
        alt="promo-image"
        className="!w-full !h-full object-cover absolute top-0 bottom-0 left-0 right-0"
      />

      <div className="z-10 !w-full flex flex-col justify-center items-center gap-8 md:!w-auto md:items-start">
        <div className="flex flex-col justify-start w-full gap-8">
          <h1 className="!font-black !text-2xl uppercase md:!text-6xl font-fraunces">
            {collection.metafield?.value}
          </h1>
          <h2 className="!font-semibold !text-lg font-fraunces">
            {collection.description}
          </h2>
        </div>

        <Link
          to={`collections/stories/${collection.handle}`}
          className="bg-dark-pink-two w-full py-2 rounded-xl !text-[#FFCCEC] text-center md:!w-[204px]"
        >
          Shop now
        </Link>
      </div>
    </div>
  );
}
