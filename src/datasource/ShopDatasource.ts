import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import {
  CustomerEntityByZone,
  PayloadApproveCustomerEntity,
  PayloadCustomerEntity,
} from "../entities/CustomerEntity";

const getCustomerById = async (id?: string) => {
  const url = `${BASE_URL}/auth/customer/get-customer?customerId=${id}`;
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

const getCustomerByTaxId = async ({ taxNo, company }: { taxNo: string; company: string }) => {
  const url = `${BASE_URL}/auth/customer/get-customer-tax?taxNo=${taxNo}&company=${company}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};

const postCustomer = async (data: PayloadCustomerEntity) => {
  const url = `${BASE_URL}/auth/customer`;
  return await httpClient.post(url, data).then((res: AxiosResponse) => res.data);
};
const updateCustomer = async (data: PayloadCustomerEntity) => {
  const url = `${BASE_URL}/auth/customer`;
  return await httpClient.patch(url, data).then((res: AxiosResponse) => res.data);
};
const getApproveTel = async ({
  company,
  isApprove,
  page,
  take,
  zone,
  text,
}: PayloadApproveCustomerEntity) => {
  const payload: any = {
    company,
    isApprove,
    page,
    take,
  };
  if (text) {
    payload.text = text;
  }
  if (zone) {
    payload.zone = zone;
  }
  const genQuery = new URLSearchParams(payload).toString();
  const url = `${BASE_URL}/auth/shop-approve-tel?${genQuery}`;

  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const getApproveTelById = async (id: string) => {
  const url = `${BASE_URL}/auth/shop-approve-tel/${id}`;

  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const getBrandList = async (company: string) => {
  const url = `${BASE_URL}/master/product-brand?company=${company}`;

  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const updateApproveTel = async ({
  approveBy,
  id,
  isApprove,
  reasonApprove,
}: {
  isApprove: boolean;
  approveBy: string;
  id: string;
  reasonApprove?: string;
}) => {
  const payload: any = {
    id,
    approveBy,
    isApprove,
  };
  if (reasonApprove) {
    payload.reasonApprove = reasonApprove;
  }

  const url = `${BASE_URL}/auth/shop-approve-tel`;

  return await httpClient
    .patch(url, payload)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => {
      throw err;
    });
};
export const shopDatasource = {
  getAllDealerZoneBySaleId,
  getCustomerById,
  getAllCustomer,
  getCustomerByTaxId,
  postCustomer,
  updateCustomer,
  getApproveTel,
  getApproveTelById,
  updateApproveTel,
  getBrandList,
};
