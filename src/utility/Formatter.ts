import moment from "moment";

const SLASH_DMY = "DD/MM/YYYY";
const SLASH_DMYHM = "DD/MM/YYYY HH:mm น.";

export const dateFormatter = (d: string, withTime?: boolean) => {
  const format = withTime ? SLASH_DMYHM : SLASH_DMY;
  return moment(d).add(543, "year").format(format);
};

export const priceFormatter = (
  price: number | string,
  fractionDigits?: number,
  reverseUnit?: boolean,
  hideUnit?: boolean,
) => {
  const digit = !fractionDigits && fractionDigits !== 0 ? 2 : fractionDigits;
  const formatter = new Intl.NumberFormat("th-TH", {
    // style: 'currency',
    currency: "THB",
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  });
  const num = typeof price === "number" ? price : parseFloat(price);
  const result = formatter.format(num);

  return isNaN(num)
    ? "-"
    : hideUnit
    ? `${formatter.format(num)}`
    : reverseUnit
    ? `${formatter.format(num)} ฿`
    : `฿ ${formatter.format(num)}`;
};

export const numberFormatter = (price: number | string, fractionDigits?: number) => {
  return priceFormatter(price, fractionDigits, false, true);
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
