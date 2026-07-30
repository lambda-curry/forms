export function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);
  return a.filter((x) => set.has(x));
}

/**
 * Computes a stable hash string for any value using deep inspection.
 * This function recursively builds a string for primitives, arrays, and objects.
 * It uses a cache (WeakMap) to avoid rehashing the same object twice, which is
 * particularly beneficial if an object appears in multiple places.
 */
function deepHash(value: unknown, cache = new WeakMap<object, string>()): string {
  // Handle primitives and null/undefined.
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  const type = typeof value;
  if (type === 'number' || type === 'boolean' || type === 'string') {
    return `${type}:${String(value)}`;
  }
  if (type === 'function') {
    // Note: using toString for functions.
    return `function:${String(value)}`;
  }

  // For objects and arrays, use caching to avoid repeated work.
  if (type === 'object') {
    const obj = value as object;
    // If we’ve seen this object before, return the cached hash.
    const cached = cache.get(obj);
    if (cached) {
      return cached;
    }
    let hash: string;
    if (Array.isArray(value)) {
      // Compute hash for each element in order.
      hash = `array:[${value.map((v) => deepHash(v, cache)).join(',')}]`;
    } else {
      // For objects, sort keys to ensure the representation is stable.
      const rec = value as Record<string, unknown>;
      const keys = Object.keys(rec).sort();
      const props = keys.map((k) => `${k}:${deepHash(rec[k], cache)}`).join(',');
      hash = `object:{${props}}`;
    }
    cache.set(obj, hash);
    return hash;
  }

  // Fallback if no case matched.
  return `${type}:${String(value)}`;
}

/**
 * Performs deep equality check for any two values.
 * This recursively checks primitives, arrays, and plain objects.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  // Check strict equality first.
  if (a === b) return true;
  // If types differ, they’re not equal.
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || a === undefined || b === undefined) return false;

  // Check arrays.
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], (b as unknown[])[i])) return false;
    }
    return true;
  }

  // Check objects.
  if (typeof a === 'object') {
    if (typeof b !== 'object') return false;
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj).sort();
    const bKeys = Object.keys(bObj).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
      if (aKeys[i] !== bKeys[i]) return false;
      if (!deepEqual(aObj[aKeys[i]], bObj[bKeys[i]])) return false;
    }
    return true;
  }

  // For any other types (should be primitives by now), use strict equality.
  return false;
}

/**
 * Returns a new array containing only the unique values from the input array.
 * Uniqueness is determined by deep equality.
 *
 * @param arr - The array of values to be filtered.
 * @returns A new array with duplicates removed.
 */
export function uniq<T>(arr: T[]): T[] {
  // Use a Map where key is the deep hash and value is an array of items sharing the same hash.
  const seen = new Map<string, T[]>();
  const result: T[] = [];

  for (const item of arr) {
    const hash = deepHash(item);
    if (seen.has(hash)) {
      // There is a potential duplicate; check the stored items with the same hash.
      const itemsWithHash = seen.get(hash) as T[];
      let duplicateFound = false;
      for (const existing of itemsWithHash) {
        if (deepEqual(existing, item)) {
          duplicateFound = true;
          break;
        }
      }
      if (!duplicateFound) {
        itemsWithHash.push(item);
        result.push(item);
      }
    } else {
      // First time this hash appears.
      seen.set(hash, [item]);
      result.push(item);
    }
  }

  return result;
}

export function take<T>(a: T[], n: number): T[] {
  return a.slice(0, n);
}

export function flatten<T>(a: T[][]): T[] {
  return a.flat();
}

export function addUniq<T>(arr: T[], values: T[]): T[] {
  return uniq([...arr, ...values]);
}

export function removeUniq<T>(arr: T[], values: T[]): T[] {
  return arr.filter((v) => !values.includes(v));
}

export function isAnyOf<T>(value: T, values: T[]): boolean {
  return values.includes(value);
}
