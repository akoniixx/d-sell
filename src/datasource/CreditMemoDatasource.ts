import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master/credit-memo`;

const getCreditMemoList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCreditMemoById = async (creditMemoId: string) => {
  return await httpClient
    .get(`${baseUrl}/${creditMemoId}`, { params: { credit_memo_id: creditMemoId } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const createCreditMemo = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/create`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateCreditMemo = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/update`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deleteCreditMemo = async (data: object) => {
  return await httpClient
    .delete(`${baseUrl}`, { data })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getCreditMemoList,
  getCreditMemoById,
  createCreditMemo,
  updateCreditMemo
};
