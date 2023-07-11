import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master/special-price`;
// const baseUrl = `http://localhost:3005/special-price`;

const getSpecialPriceList = async (params: object) => {
  return await httpClient.get(`${baseUrl}`, { params }).then((res: AxiosResponse) => res.data);
};

const getSpecialPriceByCustomerId = async (id: string) => {
  return await httpClient.get(`${baseUrl}/${id}`).then((res: AxiosResponse) => res.data);
};

const createSpecialPrice = async (data: object) => {
  return await httpClient
    .post(`${baseUrl}/create`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const updateSpecialPrice = async (data: object) => {
  return await httpClient
    .patch(`${baseUrl}/update`, data)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const deleteSpecialPrice = async (data: object) => {
  return await httpClient
    .delete(`${baseUrl}`, { data })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export {
  getSpecialPriceList,
  getSpecialPriceByCustomerId,
  createSpecialPrice,
  updateSpecialPrice,
  deleteSpecialPrice,
};
