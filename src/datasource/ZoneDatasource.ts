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
const postZone = async (payload:{company:string,zoneName:string,isActive:boolean,createBy:string}) => {
  return await httpClient.post(`${BASE_URL}/auth/zone`,payload)
  .then((res: AxiosResponse) => res.data)
  .catch((err) => console.log(err));
}
const patchZone = async (payload:{zoneId:string,company:string,zoneName:string,isActive:boolean,updateBy:string}) => {
  return await httpClient.patch(`${BASE_URL}/auth/zone`,payload)
  .then((res: AxiosResponse) => res.data)
  .catch((err) => console.log(err));
}
export const zoneDatasource = {
  getAllZone,
  getAllZoneByCompany,
  postZone,
  patchZone
};
