export function trim(value: string, letters: string = '\\s'): string {
  const begReg = new RegExp(`^[${letters}]+`, 'gm');
  const endReg = new RegExp(`[${letters}]+$`, 'gm');
  return value.replace(begReg, '').replace(endReg, '');
}

type Indexed<T = unknown> = {
  [key in string]: T;
};
export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  // eslint-disable-next-line no-restricted-syntax
  for (const p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }
    try {
      if (rhs[p] === Object(rhs[p])) {
        // eslint-disable-next-line no-param-reassign
        rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
      } else {
        // eslint-disable-next-line no-param-reassign
        lhs[p] = rhs[p];
      }
    } catch (e) {
      // eslint-disable-next-line no-param-reassign
      lhs[p] = rhs[p];
    }
  }
  return lhs;
}
export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
    [key]: acc,
  }), value as any);
  return merge(object as Indexed, result);
}
export function isObject(value: unknown): value is object {
  return value === Object(value);
}
export function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}
export function isEqual(a: object | string, b: object | string): boolean {
  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  if (typeof b !== 'string') {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(a)) {
      const compareValue = b[key as keyof typeof b];
      if ((isObject(value) && isObject(compareValue))
          || (isArray(value) && isArray(compareValue))) {
        if (isEqual(value, compareValue)) {
          continue;
        }
        return false;
      }
      if (value !== compareValue) {
        return false;
      }
    }
  }
  return true;
}
export function cloneDeep<T extends object = object>(obj: T) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.valueOf());
  }
  if (obj instanceof Array) {
    const copy: any = [];

    obj.forEach((_, i) => {
      copy[i] = cloneDeep(obj[i]);
    });

    return copy;
  }
  if (obj instanceof Set) {
    const copy = new Set();

    obj.forEach((v) => copy.add(cloneDeep(v)));

    return copy;
  }
  if (obj instanceof Map) {
    const copy = new Map();

    obj.forEach((v, k) => copy.set(k, cloneDeep(v)));

    return copy;
  }
  if (obj instanceof Object) {
    const copy: any = {};

    Object.getOwnPropertySymbols(obj).forEach((s) => {
      copy[s] = cloneDeep(obj[s as keyof typeof obj] as any);
    });
    Object.keys(obj).forEach((k) => {
      copy[k] = cloneDeep(obj[k as keyof typeof obj] as any);
    });

    return copy;
  }

  throw new Error(`Невозможно скопировать объект: ${obj}`);
}

function queryParam(key: string, value: any): string {
  if (isArray(value) || isObject(value)) {
    return Object.entries(value)
      .map(([innerKey, innerValue]) => queryParam(`${key}[${innerKey}]`, innerValue))
      .join('&');
  }
  return `${key}=${encodeURIComponent(String(value))}`;
}
export function queryStringify(data: Record<string, any>): string | never {
  if (typeof data !== 'object') {
    throw new Error('Поле data должно быть object');
  }

  const queryParams = Object.entries(data)
    .map(([key, value]) => queryParam(key, value))
    .join('&');

  return queryParams.length ? `?${queryParams}` : '';
}

export function escapeHTML(unsafe_str: string): string {
  return unsafe_str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}
