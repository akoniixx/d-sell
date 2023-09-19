export interface RoleCreatePayload {
  rolename?: string;
  roledescription?: string;
  company?: string;
  menus?: {
    menuName: string;
    permission: string[];
  }[];
  updateBy?: string;
}
