import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { SaleEntity } from "../entities/SaleEntity";

async function getUserStaff({
  page = 1,
  take = 10,
  keyword,
  isActive,
  company,
}: {
  page?: number;
  take?: number;
  keyword?: any;
  isActive?: "ACTIVE" | "INACTIVE";
  company?: "ICPI" | "ICPL" | "ICPF" | "ICK";
}) {
  const query: any = {
    page,
    take,
    company,
  };
  if (keyword) {
    query.text = keyword;
  }
  if (isActive) {
    query.isActive = isActive;
  }
  const genQuery = new URLSearchParams(query).toString();

  const url = `${BASE_URL}/auth/user-staff?${genQuery}`;

  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
}
const updateUserStaff = async (id: string, data: SaleEntity) => {
  delete data.profileImage;
  const url = `${BASE_URL}/auth/user-staff/${id}`;
  return await httpClient.patch(url, data).then((res: AxiosResponse) => res.data);
};

const createNewSaleStaff = async (data: SaleEntity) => {
  const url = `${BASE_URL}/auth/user-staff`;
  return await httpClient.post(url, data).then((res: AxiosResponse) => res.data);
};
const deleteSaleStaff = async (id?: string) => {
  const url = `${BASE_URL}/auth/user-staff/${id}`;
  return await httpClient.delete(url).then((res: AxiosResponse) => res.data);
};

const getSaleStaffById = async (id?: string) => {
  const url = `${BASE_URL}/auth/user-staff/${id}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const uploadProfile = async (data: FormData) => {
  return await httpClient
    .post(`${BASE_URL}/auth/user-staff/update-profile`, data)
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
export const SaleListDatasource = {
  getUserStaff,
  updateUserStaff,
  createNewSaleStaff,
  getSaleStaffById,
  deleteSaleStaff,
  uploadProfile,
};
