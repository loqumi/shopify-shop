export type SearchParamType =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | boolean[];

export function serializeSearchParam(param: SearchParamType) {
  if (typeof param === 'number') {
    return param.toString();
  }

  if (typeof param === 'string') {
    return param;
  }

  if (typeof param === 'boolean') {
    return param.toString();
  }

  if (Array.isArray(param)) {
    return param.join(',');
  }

  return '';
}

export function deserializeSearchParam<T extends SearchParamType>(
  value: string,
  type: 'number' | 'string' | 'boolean',
  isArray: boolean,
): T | null {
  if (type === 'string') {
    if (isArray) {
      return value.split(',').filter(Boolean) as T;
    }
    return value as T;
  }

  if (value && type === 'number') {
    if (isArray) {
      return value
        .split(',')
        .map(Number)
        .filter((n) => !Number.isNaN(n)) as T;
    }

    if (!Number.isNaN(Number(value))) {
      return Number(value) as T;
    }
  }

  if (type === 'boolean') {
    if (isArray) {
      return value
        .split(',')
        .map((s) => {
          if (s === 'true') {
            return true;
          }
          if (s === 'false') {
            return false;
          }
          return null;
        })
        .filter((b) => b !== null) as T;
    }

    if (value === 'true') {
      return true as T;
    }

    if (value === 'false') {
      return false as T;
    }
  }

  return null;
}
