import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/fcm`;

const getPromotionNotiList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/promotion-notification`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const createPromotionNoti = async (params: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion-notification`, params)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getPromotionNotiList, createPromotionNoti };
