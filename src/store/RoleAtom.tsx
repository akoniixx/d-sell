import { atom } from "recoil";

export interface RoleType {
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
  menus: any;
  roleId: string;
  roledescription: string;
  rolename: string;
  permission?: string[];
}
const roleAtom = atom<RoleType | null>({
  key: "roleAtom",
  default: null,
});
export { roleAtom };
