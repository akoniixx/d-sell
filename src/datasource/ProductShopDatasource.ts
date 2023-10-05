import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";
import { CreateProductShopEntity } from "../entities/ProductShopEntity";

const baseUrl = `${BASE_URL}/master`;

const getProductShop = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product-shop/customer`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const getProductShopByCusComId = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product-shop/product-customer`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
const createProductShop = async (params: CreateProductShopEntity) => {
  return await httpClient
    .post(`${baseUrl}/product-shop/products`, params)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getProductShop, getProductShopByCusComId, createProductShop };
