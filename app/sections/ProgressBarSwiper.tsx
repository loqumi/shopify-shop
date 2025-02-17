import {Link} from '@remix-run/react';
import {useRef, useState} from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import type {SwiperRef} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import ProgressBar from '../ui/ProgressBar';
import type {StoriesCollectionFragment} from 'storefrontapi.generated';
import StorySlide from '~/components/StorySlide';

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
            <StorySlide collection={collection} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
