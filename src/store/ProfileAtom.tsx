import { atom } from "recoil";

const profileAtom = atom({
  key: "profile",
  default: "",
});
export { profileAtom };
