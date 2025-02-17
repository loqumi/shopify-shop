import {Link} from '@remix-run/react';
import type {CategoryItemType} from '~/sections/Categories';

type CategoryItemProps = {
  categoryItem: CategoryItemType;
};

export default function CategoryItem({categoryItem}: CategoryItemProps) {
  return (
    <Link
      className="flex flex-col items-center gap-5 w-16 min-w-16 lg:w-20 lg:min-w-20"
      to={categoryItem.link}
    >
      <img
        src={categoryItem.icon}
        alt="category-icon"
        className="w-full h-full"
      />
      <p className="text-center !text-xs md:!text-base">{categoryItem.title}</p>
    </Link>
  );
}
