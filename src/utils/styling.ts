export const pixels = (value?: string | number) => {
  if (!value) return;
  const result = String(value);
  return result.endsWith('px') ? result : result + 'px';
};
