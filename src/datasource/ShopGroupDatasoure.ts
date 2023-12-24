import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/auth`;

const getShopGroup = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/customer-group`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const getShopGroupById = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/customer-group/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const createShopGroup = async (params: object) => {
  return await httpClient
    .post(`${baseUrl}/customer-group`, params)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateShopGroup = async (params: object) => {
  return await httpClient
    .patch(`${baseUrl}/customer-group`, params)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getShopGroup, getShopGroupById, createShopGroup, updateShopGroup };
