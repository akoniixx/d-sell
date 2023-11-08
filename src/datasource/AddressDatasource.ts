import axios, { AxiosRequestConfig } from "axios";

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
