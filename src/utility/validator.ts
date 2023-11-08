export const inputNumberValidator = (rule: any, value: any, callback: any) => {
  if (!parseInt(value) || parseInt(value) < 1) {
    throw new Error();
  }
  return Promise.resolve();
};

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};

export function validateOnlyNumber(t: string): string {
  const inputValue = t;
  const convertedNumber = inputValue.replace(/^0+|[^\d]/g, "");
  return convertedNumber;
}

export function validateOnlyNumWDecimal(t: string): string {
  const inputValue = t;
  const convertedNumber = inputValue.replace(/^0+|[^0-9.]/g, "");
  return convertedNumber;
}
