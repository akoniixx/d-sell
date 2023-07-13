import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const baseUrl = `${BASE_URL}/master`;

const getBrandByCompany = async (company: string) => {
  const params: any = {
    company: company,
  };
  return await httpClient
    .get(`${baseUrl}/product-brand`, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => console.log(err));
};
export { getBrandByCompany };
