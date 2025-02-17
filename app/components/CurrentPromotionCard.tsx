import {Link} from '@remix-run/react';
import type {PromotionsCollectionFragment} from 'storefrontapi.generated';

type Props = {
  promotion: PromotionsCollectionFragment;
};

export default function CurrentPromotionCard({promotion}: Props) {
  return (
    <Link to={`collections/${promotion.handle}`}>
      <img
        src={promotion.image?.url}
        alt="promotion-image"
        className="w-full object-cover aspect-video lg:mb-4 rounded-xl "
      />
      <p className="font-semibold text-[#00000033] !text-xs hidden lg:block">
        {promotion.description}
      </p>
    </Link>
  );
}
