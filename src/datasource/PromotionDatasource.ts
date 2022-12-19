import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getProductFreebies = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product-freebies`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getProductFreebieDetail = async (productId: number) => {
    return await httpClient
      .get(`${baseUrl}/product-freebies/${productId}`)
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

export {
  getProductFreebies,
  getProductFreebieDetail,
  getProductFreebieGroup,
  updateProductFreebie
};
