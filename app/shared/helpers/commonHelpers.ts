export function getKeyFromValue(options: {key: string, value: string}[], value) {
  const option = options.find(option => option.value === value);
  return option?.label || null;
}
