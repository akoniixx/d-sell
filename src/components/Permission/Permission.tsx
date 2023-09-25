import React, { ReactNode, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { RoleType, roleAtom } from "../../store/RoleAtom";
import { isArray } from "lodash";

interface Props {
  permission: string[];
  children: JSX.Element;
  reverse?: boolean;
}

const getPermissionList = (roleData: RoleType | null) => {
  const permissionList: string[] = [];
  const permissionMap: any = {};
  (roleData?.menus || []).forEach((el: { permission: any; menuName: string }) => {
    if (isArray(el.permission) && el.permission.length > 0) {
      permissionList.push(el.menuName);
      permissionMap[el.menuName] = el.permission;
    }
    if (!isArray(el.permission) && Object.keys(el.permission).length > 0) {
      permissionList.push(el.menuName);
      Object.keys(el.permission).forEach((key) => {
        if (el.permission[key].length > 0) {
          permissionList.push(key);
          permissionMap[key] = el.permission[key];
        }
      });
    }
  });
  return { permissionList, permissionMap };
};

export const checkPermission = (permission: string[], roleData: RoleType | null) => {
  const { permissionList, permissionMap } = getPermissionList(roleData);
  console.log("permissionList", permissionList, permissionMap);

  if (permission.length <= 0) return true;

  const hasMainPermission = permissionList.includes(permission[0]);
  if (!hasMainPermission) return false;

  if (!permission[1]) return true;

  return permissionMap[permission[0]]?.includes(permission[1]);
};

const Permission = ({ permission, children, reverse }: Props) => {
  const roleData = useRecoilValue(roleAtom);

  const hasPermission = useMemo(() => {
    const check = checkPermission(permission, roleData);
    return reverse ? !check : check;
  }, [roleData]);

  {
    /* 
    EXAMPLE
    <Permission permission={["manageStore"]}>
        <p>test</p>
    </Permission> 
    */
  }

  return hasPermission ? children : <></>;
};

export default Permission;
