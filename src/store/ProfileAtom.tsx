import { atom } from "recoil";

const profileAtom = atom({
  key: "profile",
  default: {
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    userStaffId: "",
  },
});
export { profileAtom };
