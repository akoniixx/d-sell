import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const getUnitMea = async (company: string) => {
  return await httpClient
    .get(`${BASE_URL}/master/unit-mea/${company}`)
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
export { getUnitMea };
