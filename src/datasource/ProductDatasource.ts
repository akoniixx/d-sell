import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getProductList = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductGroup = async (company: string) => {
  return await httpClient
    .get(`${baseUrl}/product/product-group/${company}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductCategory = async (company: string) => {
  return await httpClient
    .get(`${baseUrl}/product-category`, { params: { company } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductBrand = async (company: string) => {
  return await httpClient
    .get(`${baseUrl}/product-brand`, { params: { company } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductDetail = async (productId: number) => {
  return await httpClient
    .get(`${baseUrl}/product/product-by-id`, { params: { productId } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateProduct = async (data: FormData) => {
  return await httpClient
    .post(`${baseUrl}/product/update-product`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const syncProduct = async (data: { company: string }) => {
  return await httpClient
    .post(`${BASE_URL}/nav/product`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductUnit = async (company: string, itemNo: string) => {
  return await httpClient
    .get(`${BASE_URL}/nav/uom-nav?company=${company}&itemNo=${itemNo}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getProductList,
  getProductGroup,
  getProductCategory,
  getProductBrand,
  getProductDetail,
  updateProduct,
  syncProduct,
  getProductUnit,
};
