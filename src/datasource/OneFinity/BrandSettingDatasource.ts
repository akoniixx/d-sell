import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL, NAV_URL, httpClient } from "../../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getBrandSetting = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/onefinity-product-brand`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const getBrandById = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/onefinity-product-brand/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const createBrand = async (data: FormData) => {
  return await httpClient
    .post(`${baseUrl}/onefinity-product-brand/create-product-brand`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateBrand = async (data: FormData) => {
  return await httpClient
    .patch(`${baseUrl}/onefinity-product-brand/update-product-brand`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getBrandSetting, getBrandById, createBrand, updateBrand };
