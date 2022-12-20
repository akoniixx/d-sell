import { httpClient, BASE_URL } from "../config/develop-config";
import { RoleCreatePayload } from "../entities/RoleEntity";

interface InitialParams {
  page: number;
  take: number;
  text?: any;
  company: "ICPI" | "ICPL" | "ICPF" | "ICK" | undefined;
}
const getAllRoles = async ({ page, take, text, company }: InitialParams) => {
  const query: any = {
    page,
    take,
    company,
  };
  if (text) {
    query.text = text;
  }

  const generateQuery = new URLSearchParams(query).toString();
  const url = BASE_URL + `/auth/role-management?${generateQuery}`;
  return await httpClient.get(url).then((res) => res.data);
};
const createNewRole = async (data: RoleCreatePayload) => {
  const url = BASE_URL + `/auth/role-management`;
  return await httpClient.post(url, data).then((res) => res.data);
};
const getRoleById = async (id?: string, company?: string) => {
  const url = BASE_URL + `/auth/role-management/${id}?company=${company}&id=${id}`;
  return await httpClient.get(url).then((res) => res.data);
};
const updateRole = async (id: string, data: RoleCreatePayload) => {
  const url = BASE_URL + `/auth/role-management/${id}`;
  return await httpClient.patch(url, data).then((res) => res.data);
};
const deleteRole = async (id: string) => {
  const url = BASE_URL + `/auth/role-management/${id}`;
  return await httpClient.delete(url).then((res) => res.data);
};
export const roleDatasource = { getAllRoles, createNewRole, getRoleById, updateRole, deleteRole };
