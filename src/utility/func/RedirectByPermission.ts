import { isArray } from "lodash";
import { protectRoutesData } from "../../WebRoutes";

export const redirectByRole = (menus?: string) => {
  if (!menus) return "/";
  const newMenus: {
    menuName: string;
    permission: string[];
  }[] = JSON.parse(menus);
  const reduceNested = protectRoutesData.reduce((acc: any, cur) => {
    if (cur.nestedRoutes.length > 0) {
      return [
        ...acc,
        ...cur.nestedRoutes.map((el) => {
          return {
            ...el,
            path: cur.path.replace("/*", "") + "/" + el.path.replace("/*", ""),
          };
        }),
      ];
    } else {
      return [...acc, cur];
    }
  }, []);
  const redirectPath = reduceNested.find((el: any) => {
    if (el.permission === null) {
      return true;
    }
    return newMenus.some((menu) => {
      return (
        (menu.permission || []).includes(el.permission.action) &&
        menu.menuName === el.permission.name
      );
    });
  });
  return redirectPath?.path || "/";
};
export const checkPermission = (menus?: string, path?: string) => {
  if (!menus) return false;
  const newMenus: {
    menuName: string;
    permission: string[];
  }[] = JSON.parse(menus);

  const reduceNested = protectRoutesData.reduce((acc: any, cur) => {
    if (cur.nestedRoutes.length > 0) {
      return [
        ...acc,
        ...cur.nestedRoutes.map((el) => {
          return {
            ...el,
            path: cur.path.replace("/*", "") + "/" + el.path.replace("/*", ""),
          };
        }),
      ];
    } else {
      return [...acc, cur];
    }
  }, []);
  const redirectPath = reduceNested.find((el: any) => {
    const findSamePath = el.path === path;
    return findSamePath;
  });
  const isPermission = newMenus.some((menu) => {
    if (redirectPath?.permission === null) {
      return true;
    }
    return (
      (menu?.permission || []).includes(redirectPath?.permission?.action) &&
      menu.menuName === redirectPath?.permission.name
    );
  });
  return isPermission;
};
export const checkPermissionRenderMenu = ({
  menus,
  permission,
}: {
  menus?: {
    menuName: string;
    permission: string[];
    menu: any;
  }[];
  permission: string[];
}) => {
  const isHaveSubMenu = menus
    ?.map((el) => el.menu)
    .some((el) => (isArray(el) ? true : Object.keys(el).length > 0));
  const isPermission = menus?.some((menu) => {
    return permission.includes(menu.menuName);
  });

  return isPermission && isHaveSubMenu;
};
export const checkPermissionRenderSubMenu = ({
  permission,
  subMenuName,
}: {
  permission: string[][];
  subMenuName: string;
}) => {
  const isPermission = permission.some((menu) => {
    return menu.includes(subMenuName);
  });

  return isPermission;
};
