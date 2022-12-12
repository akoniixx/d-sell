import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const getAllZone = async () => {
  const url = `${BASE_URL}/auth/zone`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
const getAllZoneByCompany = async (company?: string) => {
  const url = `${BASE_URL}/auth/zone/${company}`;
  return await httpClient.get(url).then((res: AxiosResponse) => res.data);
};
export const zoneDatasource = {
  getAllZone,
  getAllZoneByCompany,
};
