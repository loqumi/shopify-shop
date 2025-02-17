import {useAside} from '~/components/Aside';

export default function FiltersToggle() {
  const {open} = useAside();

  return (
    <button
      className="flex gap-4 cursor-pointer"
      onClick={() => open('filters')}
    >
      <img src="/filters.svg" alt={'filters'} />
      <p className="!text-sm font-noto">Filters</p>
    </button>
  );
}
