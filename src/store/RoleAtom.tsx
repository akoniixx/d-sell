import { atom } from "recoil";

export interface RoleType {
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
  menus: string;
  roleId: string;
  roledescription: string;
  rolename: string;
}
const roleAtom = atom<RoleType | null>({
  key: "roleAtom",
  default: null,
});
export { roleAtom };