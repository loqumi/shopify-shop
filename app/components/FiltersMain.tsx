import debounce from 'lodash/debounce';
import ReactSlider from 'react-slider';
import React, {useMemo, useState} from 'react';
import styles from '~/styles/search/search.module.css';
import {useSearchParamsState} from '~/hooks/useSearchParamsState';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {useAside} from '~/components/Aside';

interface FiltersMainProps {
  vendors: string[];
  productTypes: string[];
  maxPrice: {amount: string; currencyCode: string};
}

export function FiltersMain({
  maxPrice,
  vendors,
  productTypes,
}: FiltersMainProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {close} = useAside();

  const [inStock, setInStock] =
    useSearchParamsState<StorefrontAPI.SearchUnavailableProductsType>(
      'available',
      'HIDE',
      'string',
    );
  const [maxValue, setMaxValue] = useSearchParamsState<number>(
    'max',
    Number(maxPrice.amount),
    'number',
  );
  const [minValue, setMinValue] = useSearchParamsState<number>(
    'min',
    0,
    'number',
  );

  const [brand, setBrand] = useSearchParamsState<string>('brand', '', 'string');
  const [productType, setProductType] = useSearchParamsState<string>(
    'productType',
    '',
    'string',
  );

  const [discount, setDiscount] = useSearchParamsState<string>(
    'discount',
    'HIDE',
    'string',
  );

  const currencySymbols: {[key: string]: string} = {
    USD: '$',
    EUR: '€',
  };

  function getCurrencySymbol(currencyCode: string) {
    return currencySymbols[currencyCode] || currencyCode;
  }

  const handleChangeRange = useMemo(
    () =>
      debounce((value: [number, number], index: number) => {
        if (index === 0) setMinValue(value[index]);
        if (index === 1) setMaxValue(value[index]);
      }, 400),
    [setMaxValue, setMinValue],
  );

  const handleChangeInStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStock(e.target.checked ? 'SHOW' : 'HIDE');
  };

  const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(e.target.checked ? 'SHOW' : 'HIDE');
  };

  const handleBrandChange = (item: string) => {
    setBrand(brand === item ? '' : item);
  };

  const handleProductTypeChange = (item: string) => {
    setProductType(productType === item ? '' : item);
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
    setSearchTerm('');
  };

  const filteredItems = (items: string[]) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(lowerSearchTerm));
  };

  const sortedItemsByAlphabet = (items: string[]) => {
    const sortedItems = [...items].sort();
    const grouped: {[key: string]: string[]} = {};
    sortedItems.forEach((item) => {
      const letter = item[0]?.toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(item);
    });
    return grouped;
  };

  const renderDropdownItems = (
    items: string[],
    selectedValue: string,
    onItemClick: (item: string) => void,
  ) => {
    const filteredGroupedItems = sortedItemsByAlphabet(filteredItems(items));
    return (
      <>
        <div className={'relative'}>
          <input
            type="text"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-[42px] px-2 py-1 border rounded focus:outline-none focus:shadow-outline"
          />
          <img
            className={'absolute top-3 right-2'}
            src={'/search-icon.svg'}
            alt={'search-icon'}
          />
        </div>

        <div>
          {Object.entries(filteredGroupedItems).map(
            ([letter, groupedItems]) => (
              <div className={'gap-2 flex flex-col'} key={letter}>
                <h3 className="mt-4 font-bold text-start font-fraunces text-lg">
                  {letter}
                </h3>
                {groupedItems.map((item) => (
                  <label
                    key={item}
                    className="flex py-2 px-4 rounded-lg items-center space-x-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValue === item}
                      onChange={() => onItemClick(item)}
                      className={`${styles.checkboxInput} hidden peer`}
                    />
                    <div
                      className={`${styles.checkboxLabel} w-10 h-10 rounded-lg bg-main-pink peer-checked:hover:bg-dark-pink-two hover:bg-main-green peer-checked:bg-dark-pink-two flex items-center justify-center transition-all duration-300`}
                    >
                      <svg viewBox="0,0,50,50" className={styles.checkboxSvg}>
                        <path
                          d="M5 30 L 20 45 L 45 5"
                          className={styles.checkboxPath}
                        ></path>
                      </svg>
                    </div>
                    <span className="font-fraunces font-bold uppercase">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            ),
          )}
        </div>
      </>
    );
  };

  return (
    <div>
      <label htmlFor="inStock" className={styles.checkboxWrapper}>
        in stock
        <input
          id="inStock"
          type="checkbox"
          className={styles.toggleCheckbox}
          checked={inStock === 'SHOW'}
          onChange={handleChangeInStock}
        />
        <span className={styles.avacadoCheckbox}></span>
      </label>

      <label htmlFor="discount" className={styles.checkboxWrapper}>
        discount
        <input
          id="discount"
          type="checkbox"
          className={styles.toggleCheckbox}
          checked={discount === 'SHOW'}
          onChange={handleChangeDiscount}
        />
        <span className={styles.avacadoCheckbox}></span>
      </label>

      <div className="mt-4 mb-4">
        <div className="flex justify-between">
          <p className="text-xs">
            From {minValue}
            {getCurrencySymbol(maxPrice.currencyCode)}
          </p>
          <p className="text-xs">
            To {maxValue}
            {getCurrencySymbol(maxPrice.currencyCode)}
          </p>
        </div>
        <ReactSlider
          className="flex top-[10px] border-r-[8px] h-[1px] bg-black items-center"
          thumbClassName="cursor-move w-[24px] h-[24px] rounded-full bg-[#F73E9F] text-transparent"
          defaultValue={[0, Number(maxPrice.amount)]}
          max={Number(maxPrice.amount)}
          onChange={handleChangeRange}
          renderThumb={({key, ...props}, state) => (
            <div key={key} {...props}>
              {state.valueNow}
            </div>
          )}
          minDistance={5}
        />
      </div>

      <div className="mt-12 flex flex-col gap-4">
        {vendors[0] !== '' && (
          <div>
            <button
              className="flex gap-2 py-2 px-4 rounded-lg justify-between cursor-pointer items-center hover:bg-gray-100 transition-colors duration-200 w-full"
              onClick={() => toggleFilter('brand')}
            >
              <span className="capitalize">brand</span>
              <img
                src="/plus-icon.svg"
                alt="plus-icon"
                className={`transform transition-transform duration-300 ${
                  openFilter === 'brand' ? 'rotate-45' : 'rotate-0'
                }`}
              />
            </button>
            {openFilter === 'brand' && (
              <div
                className="transition-max-height duration-500 ease-in-out max-h-0"
                style={{maxHeight: openFilter === 'brand' ? '100%' : '0'}}
              >
                <div className="mt-2">
                  {renderDropdownItems(vendors, brand, handleBrandChange)}
                </div>
              </div>
            )}
          </div>
        )}

        {productTypes[0] !== '' && (
          <div>
            <button
              className="flex gap-2 py-2 px-4 rounded-lg justify-between cursor-pointer items-center hover:bg-gray-100 transition-colors duration-200 w-full"
              onClick={() => toggleFilter('productType')}
            >
              <span className="capitalize">product type</span>
              <img
                src="/plus-icon.svg"
                alt="plus-icon"
                className={`transform transition-transform duration-300 ${
                  openFilter === 'productType' ? 'rotate-45' : 'rotate-0'
                }`}
              />
            </button>
            {openFilter === 'productType' && (
              <div
                className="transition-max-height duration-500 ease-in-out max-h-0"
                style={{maxHeight: openFilter === 'productType' ? '100%' : '0'}}
              >
                <div className="mt-2">
                  {renderDropdownItems(
                    productTypes,
                    productType,
                    handleProductTypeChange,
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className={
          'bg-dark-pink-two font-semibold font-noto !text-white p-2 rounded-xl w-full my-8'
        }
        onClick={close}
      >
        Show products
      </button>
    </div>
  );
}
