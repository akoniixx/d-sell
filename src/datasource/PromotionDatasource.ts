import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getProductFreebies = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product-freebies`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const syncProductFreebie = async (data: { company: string }) => {
  return await httpClient
    .post(`${BASE_URL}/nav/freebies`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductFreebieDetail = async (productId: number) => {
  return await httpClient
    .get(`${baseUrl}/product-freebies/${productId}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductFreebiePromotionDetail = async (productId: number) => {
  return await httpClient
    .get(`${baseUrl}/product-freebies/freebies-promotion/${productId}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductFreebieGroup = async (company: string) => {
  return await httpClient
    .get(`${baseUrl}/product-freebies/product-group/${company}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateProductFreebie = async (data: FormData) => {
  return await httpClient
    .post(`${baseUrl}/product-freebies/update-product`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getPromotion = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/promotion`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getPromotionById = async (promotionId: string) => {
  return await httpClient
    .get(`${baseUrl}/promotion/${promotionId}`, { params: { promotionId } })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const checkPromotionCode = async (params: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion/check-promotion-code`, null, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const createPromotion = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion/create`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updatePromotion = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion/update`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updatePromotionStatus = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion/update-status`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updatePromotionFile = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/promotion/update-file`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deletePromotion = async (data: object) => {
  return await httpClient
    .delete(`${baseUrl}/promotion`, { data })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getPromotionLog = async (promotionId: string) => {
  return await httpClient
    .post(`${baseUrl}/promotion/promotion-history?promotionId=${promotionId}`, { promotionId })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getProductFreebies,
  syncProductFreebie,
  getProductFreebieDetail,
  getProductFreebieGroup,
  updateProductFreebie,
  getPromotion,
  getPromotionById,
  checkPromotionCode,
  createPromotion,
  updatePromotion,
  updatePromotionFile,
  updatePromotionStatus,
  deletePromotion,
  getPromotionLog,
  getProductFreebiePromotionDetail,
};
