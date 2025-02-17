import CategoryItem from '~/ui/CategoryItem';

export type CategoryItemType = {
  icon: string;
  title: string;
  link: string;
};

const categories: CategoryItemType[] = [
  {icon: '/discount-category-icon.svg', title: 'Discounts', link: ''},
  {icon: '/avocado-category-icon.svg', title: 'Fashion jewelry', link: ''},
  {icon: '/home-category-icon.svg', title: 'Avocard', link: ''},
  {icon: '/card-category-icon.svg', title: 'Gift cards', link: ''},
  {icon: '/fire-category-icon.svg', title: 'Hot', link: ''},
  {icon: '/heart-category-icon.svg', title: 'For me', link: ''},
  {icon: '/points-category-icon.svg', title: 'Подарки за баллы', link: ''},
];

export default function Categories() {
  return (
    <div className="flex gap-6 pt-12 pb-6 md:pb-12 px-4 lg:px-main bg-main-pink overflow-x-scroll  md:justify-between">
      {categories.map((category) => (
        <CategoryItem categoryItem={category} key={category.title} />
      ))}
    </div>
  );
}
