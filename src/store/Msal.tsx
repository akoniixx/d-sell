import { atom } from "recoil";

const msal = atom({
  key: "msal",
  default: null,
});
export { msal };
