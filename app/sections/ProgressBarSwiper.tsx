import {Link} from '@remix-run/react';
import {useRef, useState} from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import type {SwiperRef} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import ProgressBar from '../ui/ProgressBar';
import type {StoriesCollectionFragment} from 'storefrontapi.generated';

type Props = {
  collections: StoriesCollectionFragment[];
};

export default function ProgressBarSwiper({collections}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);

  function handleProgressComplete() {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  }

  function isProgressBarFilled(index: number) {
    if (activeIndex === 0) return false;
    return (
      index < activeIndex ||
      (activeIndex === 0 && index === collections.length - 1)
    );
  }

  return (
    <div className="w-full mx-auto relative overflow-hidden">
      <div className="flex absolute top-[18px] z-10 w-[100%] px-4 md:px-main">
        {collections.map((collection, index) => (
          <div
            key={`progress-${collection.id}`}
            className="flex-1 mr-1 last:mr-0"
          >
            <ProgressBar
              key={`progress-${collection.id}`}
              duration={5000}
              isActive={index === activeIndex}
              isFilled={isProgressBarFilled(index)}
              onComplete={handleProgressComplete}
            />
          </div>
        ))}
      </div>

      <Swiper
        slidesPerView={1}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        ref={swiperRef}
        className="h-[600px] md:h-[400px]"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id}>
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
                  to={`collections/${collection.handle}`}
                  className="bg-dark-pink-two w-full py-2 rounded-xl !text-[#FFCCEC] text-center md:!w-[204px]"
                >
                  Shop now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
