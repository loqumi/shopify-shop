import {useSearchParams} from 'react-router-dom';
import {
  type SearchParamType,
  deserializeSearchParam,
  serializeSearchParam,
} from './helper';

/**
 * A custom hook to manage search params state in the URL. The returned array includes
 * the current value for the specified search parameter and a function to update its value.
 *
 * @template T - The type of the search parameter value; extends SearchParamType
 * @param {string} searchParamName - The name of the search parameter
 * @param {T | T[]} defaultValue - The default value for the search parameter
 * @param {'number' | 'string' | 'boolean'} type - The type of the search parameter value
 * @returns {readonly [T | T[], (newState: T | T[]) => void]} - A tuple with the current value and a function to update the search parameter
 *
 * @example
 * const [offset, setOffset] = useSearchParamsState<number>('offset', 10, 'number');
 * const [ids, setIds] = useSearchParamsState<number[]>('ids', [], 'number');
 */

export function useSearchParamsState<T extends string | number | boolean>(
  searchParamName: string,
  defaultValue: T[],
  type: 'number' | 'string' | 'boolean',
): [currentState: T[], setState: (newState: T[]) => void];
export function useSearchParamsState<T extends SearchParamType>(
  searchParamName: string,
  defaultValue: T,
  type: 'number' | 'string' | 'boolean',
): [currentState: T, setState: (newState: T) => void];
export function useSearchParamsState<T extends SearchParamType>(
  searchParamName: string,
  defaultValue: T,
  type: 'number' | 'string' | 'boolean',
): readonly [currentState: T, setState: (newState: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  let currentState = defaultValue;
  const acquiredSearchParam = searchParams.get(searchParamName);

  if (acquiredSearchParam !== null) {
    currentState =
      deserializeSearchParam<T>(
        acquiredSearchParam,
        type,
        Array.isArray(defaultValue),
      ) ?? defaultValue;
  }

  const setState = (newState: T) => {
    searchParams.set(searchParamName, serializeSearchParam(newState));

    setSearchParams(searchParams);
  };

  return [currentState as T, setState];
}
