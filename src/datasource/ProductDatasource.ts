import { AxiosResponse } from "axios";
import { BASE_URL, NAV_URL, httpClient } from "../config/develop-config";
import { payloadProductBrand } from "../entities/ProductBrandEntity";

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

const getProductBrandEx = async (payload: payloadProductBrand) => {
  return await httpClient
  .get(`${baseUrl}/product-brand/ex`, { params:  payload  })
  .then((res: AxiosResponse) => res.data)
  .catch((err) => console.log(err));
}

const getProductBrandById = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/product-brand/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const postProductBrand = async(data:FormData)=> {
  return await httpClient
  .post(`${baseUrl}/product-brand/create-product-brand`,data)
  .then((res: AxiosResponse) => res.data)
  .catch((err) => console.log(err));
}

const patchProductBrand = async(data:FormData)=> {
  return await httpClient
  .patch(`${baseUrl}/product-brand/update-product-brand`,data)
  .then((res: AxiosResponse) => res.data)
  .catch((err) => console.log(err));
}

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
    .post(`${NAV_URL}/product`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductUnit = async (company: string, itemNo: string) => {
  return await httpClient
    .get(`${NAV_URL}/uom-nav?company=${company}&itemNo=${itemNo}`)
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
  getProductBrandEx,
  getProductBrandById,
  postProductBrand,
  patchProductBrand
};
