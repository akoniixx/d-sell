import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getProductShop = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/product-shop/customer`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getProductShop };
