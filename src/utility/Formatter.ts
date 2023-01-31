export const priceFormatter = (
  price: number | string,
  fractionDigits?: number,
  reverseUnit?: boolean,
  hideUnit?: boolean,
) => {
  const formatter = new Intl.NumberFormat("th-TH", {
    // style: 'currency',
    currency: "THB",
    minimumFractionDigits: fractionDigits || 2,
    maximumFractionDigits: fractionDigits || 2,
  });
  const num = typeof price === "number" ? price : parseFloat(price);
  const result = formatter.format(num);

  return hideUnit
    ? `${formatter.format(num)}`
    : reverseUnit
    ? `${formatter.format(num)} ฿`
    : `฿ ${formatter.format(num)}`;
};

export const nameFormatter = (input: string) => {
  if (!input) return "";
  const upperCaseFirstLetter = `${input.slice(0, 1).toUpperCase().slice(1)}`;

  const lowerCaseAllWordsExceptFirstLetters = input?.replaceAll(
    /\S*/g,
    (word) => `${word?.slice(0, 1)}${word.slice(1).toLowerCase()}`,
  );

  return upperCaseFirstLetter + lowerCaseAllWordsExceptFirstLetters;
};
