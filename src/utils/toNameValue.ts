export function toNameValue<T, K extends keyof T, N extends keyof T>(
  list: T[],
  valueKey: K,
  nameKey: N
) {
  return list.map(item => ({
    value: String(item[valueKey] ?? ""),
    name: String(item[nameKey] ?? ""),
  }))
}