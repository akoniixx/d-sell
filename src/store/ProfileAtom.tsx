import { atom } from "recoil";

export interface Profile {
  email: string;
  firstname: string;
  lastname: string;
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
  role: string;
  userStaffId: string;
  [key: string]: any;
}
const profileAtom = atom<Profile | null>({
  key: "profile",
  default: null,
});

export { profileAtom };
