import moment from "moment";

export function numberWithCommas(x: number) {
  if (!x) return 0;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(d: string) {
  return moment(d).format("DD/MM/yyyy");
}

export function formatMoney(amount: number) {
  return amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function maximumLetters(l: string, max: number) {
  if (l.length < max) {
    return l;
  } else {
    return l.substring(0, max) + "...";
  }
}

export function capitalize(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
