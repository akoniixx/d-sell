import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { CreateConditionCOEntiry } from "../entities/ConditionCOEntiry";

const baseUrl = `${BASE_URL}/master`;

const getCreditMemoList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCustomerCreditMemoList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo-shop`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCustomerCreditMemo = async (customer_company_id: number | string) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo-shop/detail/${customer_company_id}`, {
      params: { customer_company_id },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCustomerCreditMemoHistory = async (customer_company_id: number | string) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo-shop/history/${customer_company_id}`, {
      params: { customer_company_id },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCreditMemoById = async (creditMemoId: string) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo/${creditMemoId}`, { params: { credit_memo_id: creditMemoId } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCreditHistory = async (creditMemoId: string) => {
  return await httpClient
    .get(`${baseUrl}/credit-memo-history/${creditMemoId}`, {
      params: { credit_memo_id: creditMemoId },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const createCreditMemo = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/credit-memo/create`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateCreditMemo = async (data: object) => {
  return await httpClient
    .patch(`${baseUrl}/credit-memo`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deleteCreditMemo = async (data: object) => {
  return await httpClient
    .delete(`${baseUrl}/credit-memo`, { data })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateCreditMemoStatus = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/credit-memo/update-status`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getOrderHistory = async (params: {
  page?: number;
  take?: number;
  customerCompanyId: string;
}) => {
  return await httpClient
    .get(`${BASE_URL}/cart/order-credit-memo`, {
      params,
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getConditionCO = async (params: { page?: number; take?: number; company: string }) => {
  return await httpClient
    .get(`${BASE_URL}/co-condition`, {
      params,
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getConditionCoById = async (conditionId: string) => {
  return await httpClient
    .get(`${BASE_URL}/co-condition/${conditionId}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const createConditionCO = async (params: CreateConditionCOEntiry) => {
  return await httpClient
    .post(`${BASE_URL}/co-condition/create`, {
      params,
    })
    .then((res: AxiosResponse) => console.log(res))
    .catch((err) => console.log(err));
};

export {
  getCreditMemoList,
  getCustomerCreditMemoList,
  getCustomerCreditMemo,
  getCustomerCreditMemoHistory,
  getCreditMemoById,
  getCreditHistory,
  createCreditMemo,
  updateCreditMemo,
  updateCreditMemoStatus,
  getOrderHistory,
  deleteCreditMemo,
  createConditionCO,
  getConditionCO,
  getConditionCoById,
};
