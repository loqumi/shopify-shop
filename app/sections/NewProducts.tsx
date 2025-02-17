import {useRef} from 'react';
import type {NewProductFragment} from 'storefrontapi.generated';
import 'swiper/css';
import type {SwiperRef} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {ShopifyProduct} from 'types/ShopifyProduct';
import ProductItemUpdated from '~/components/ProductItemUpdated';

type Props = {
  products: NewProductFragment[];
};

export default function NewProducts({products}: Props) {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <div className="bg-main-pink pt-6 px-4 lg:px-main pb-12 md:pb-24">
      <div className="md:flex md:justify-between md:items-center !mb-6">
        <button
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          className="hidden md:block"
        >
          <img src="/arrow-swiper.svg" alt="swiper-arrow" />
        </button>

        <h1 className="!font-black !text-2xl md:text-center font-fraunces">
          new products
        </h1>

        <button
          onClick={() => swiperRef.current?.swiper.slideNext()}
          className="hidden md:block"
        >
          <img
            src="/arrow-swiper.svg"
            alt="swiper-arrow"
            className="rotate-180"
          />
        </button>
      </div>

      {/* mobile view */}
      {/* <div className="flex md:!hidden overflow-x-scroll gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div> */}

      {/* desktop view */}
      <Swiper
        breakpoints={{
          380: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 60,
          },
        }}
        slidesPerView="auto"
        spaceBetween={60}
        ref={swiperRef}
        id="newProductsSwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} style={{height: '100%'}}>
            <ProductItemUpdated
              hasCartButton
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
