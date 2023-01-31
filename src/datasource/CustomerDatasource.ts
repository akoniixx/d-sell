import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/auth`;

const getCustomers = async (params: object) => {
  return await httpClient
    .get(`${baseUrl}/customer-company`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getCustomersById = async (id: string) => {
  return await httpClient
    .get(`${baseUrl}/customer-company/${id}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

const getZones = async (company: string) => {
  return await httpClient
    .get(`${baseUrl}/zone/${company}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export { getCustomers, getCustomersById, getZones };
