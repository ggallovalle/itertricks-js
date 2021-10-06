export function updateMap<TKey, TValue>(
  map: Map<TKey, TValue>,
  key: TKey,
  updater: (x: TValue) => TValue
): void {
  const last = map.get(key) as TValue;
  map.set(key, updater(last));
}

export function upsertMap<TKey, TValue>(
  source: Map<TKey, TValue>,
  key: TKey,
  defaultValue: TValue,
  updater: (x: TValue) => TValue
): void {
  if (source.has(key)) {
    updateMap(source, key, updater);
  } else {
    source.set(key, defaultValue);
  }
}
