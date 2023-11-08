import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/fcm`;

const getPromotionNotiList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/promotion-notification`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const getPromotionNotiById = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/promotion-notification/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const createPromotionNoti = async (params: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion-notification`, params)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const updatePromotionNoti = async (data: object) => {
  return await httpClient
    .patch(`${baseUrl}/promotion-notification`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deletePromotionNoti = async (id: string) => {
  return await httpClient
    .delete(`${baseUrl}/promotion-notification/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getPromotionNotiList,
  createPromotionNoti,
  getPromotionNotiById,
  deletePromotionNoti,
  updatePromotionNoti,
};
