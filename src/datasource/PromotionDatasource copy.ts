import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/auth/customer`;

const getCustomers = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/get-all-customer`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};


export {
  getCustomers
};
