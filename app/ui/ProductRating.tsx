import StarIcon from './StarIcon';

type Props = {
  rating: number;
  reviewsNumber: number;
  productPage?: boolean;
};

export default function ProductRating({
  rating,
  reviewsNumber,
  productPage,
}: Props) {
  return (
    <div className="flex gap-1.5">
      <div className="flex gap-0.5 items-center">
        {[...Array(5)].map((i, index) =>
          index < rating ? (
            <StarIcon
              key={`star-icon-${index}`}
              color={productPage ? '#3C3C4399' : 'black'}
            />
          ) : (
            <StarIcon
              key={`star-icon-${index}`}
              color={productPage ? 'white' : 'black'}
              stroke={productPage}
              invisible={!productPage}
            />
          ),
        )}
      </div>
      {productPage ? (
        <p className="font-normal text-[#3C3C4399] text-sm">{`(${reviewsNumber} reviews)`}</p>
      ) : (
        <p className="font-semibold !text-lg text-[#3C3C4399] font-noto">
          {reviewsNumber}
        </p>
      )}
    </div>
  );
}
