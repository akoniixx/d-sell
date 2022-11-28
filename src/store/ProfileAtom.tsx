import { atom } from "recoil";

interface Profile {
  email: string;
  firstname: string;
  lastname: string;
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
  role: string;
  userStaffId: string;
  [key: string]: any;
}
const profileAtom = atom<Profile>({
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
