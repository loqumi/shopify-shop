import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/20/solid';
import {Form, useSearchParams} from '@remix-run/react';

type Props = {
  options: {title: string; value: string}[];
};

export default function Dropdown({options}: Props) {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort') || options[0].value;

  return (
    <Listbox value={sort}>
      <ListboxButton className="relative flex cursor-default rounded-md bg-transparent  text-left text-gray-900 focus:outline-none sm:text-sm cursor-pointer">
        <span className="flex items-center">
          <span className="block truncate lowercase !text-sm font-noto">
            {options.find((option) => option.value === sort)?.title}
          </span>
        </span>
        <span className="pointer-events-none inset-y-0 right-0 ml-3 flex items-center pr-2">
          <img src={'/filter-arrow.svg'} alt={'arrow-down'} />
        </span>
      </ListboxButton>

      <ListboxOptions
        anchor={{to: 'bottom start', gap: '4px'}}
        transition
        className="absolute z-10 mt-1 max-h-56 rounded-md bg-[#D5E882] py-1 text-base shadow-lg sm:text-sm"
      >
        <Form>
          {options.map((option) => (
            <ListboxOption
              key={option.title}
              value={option.title}
              className="group relative cursor-default select-none text-gray-900 data-[focus]:bg-black data-[focus]:text-white"
            >
              <button
                className="cursor-pointer py-2 pl-3 pr-9"
                name="sort"
                value={option.value}
              >
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  {option.title}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-black group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              </button>
            </ListboxOption>
          ))}
        </Form>
      </ListboxOptions>
    </Listbox>
  );
}
