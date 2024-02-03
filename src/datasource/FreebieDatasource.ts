import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const createFreebieCorporate = async (data: FormData) => {
  return await httpClient
    .post(`${BASE_URL}/master/product-freebies/create-product-ex`, data)
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
const updateFreebieCorporate = async (data: FormData) => {
  return await httpClient
    .post(`${BASE_URL}/master/product-freebies/update-product-ex`, data)
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export { createFreebieCorporate, updateFreebieCorporate };
