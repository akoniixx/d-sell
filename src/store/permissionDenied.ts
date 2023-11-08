import { atom } from "recoil";

interface PermissionModalState {
  visible: boolean;
}

export const permissionDenied = atom<PermissionModalState>({
  key: "permissionDenied",
  default: {
    visible: true,
  },
});
