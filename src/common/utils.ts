export const converterConfig = (value, type) => {
  console.log(value);
  if (type === Boolean) {
    return value === 'true' || value === 1 || value;
  }
  return true;
};
