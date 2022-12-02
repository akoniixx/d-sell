import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { CustomerEntityByZone } from "../entities/CustomerEntity";

const getCustomerById = async (id?: string) => {
  const url = `${BASE_URL}/auth/customer/get-customer/${id}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const getAllDealerZoneBySaleId = async (id?: string) => {
  const url = `${BASE_URL}/auth/customer/get-dealer-zone/${id}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const getAllCustomer = async ({
  zone,
  sortField,
  sortDirection,
  searchText,
  page,
  take,
}: CustomerEntityByZone) => {
  const query: any = {
    page,
    take,
  };
  if (zone) {
    query.zone = zone;
  }
  if (sortField) {
    query.sortField = sortField;
  }
  if (sortDirection) {
    query.sortDirection = sortDirection;
  }
  if (searchText) {
    query.searchText = searchText;
  }
  const genQuery = new URLSearchParams(query).toString();
  const url = `${BASE_URL}/auth/customer/get-all-customer?${genQuery}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
export const shopDatasource = {
  getAllDealerZoneBySaleId,
  getCustomerById,
  getAllCustomer,
};
