import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { httpClient, BASE_ICONKASET_URL } from "../config/develop-config";

interface Address {
  searchText?: any;
  page?: number;
  limit?: number;
}

const getAllProvince = async () => {
  return await axios.get(`/provinces`);
};

export const addressDatasource = {
  getAllProvince,
};

export const getProvince = async () => {
  return await httpClient
    .get(`${BASE_ICONKASET_URL}/master-address`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};

export const getMasterAddress = async (proId: number) => {
  return await httpClient
    .get(`${BASE_ICONKASET_URL}/master-address/${proId}`)
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
