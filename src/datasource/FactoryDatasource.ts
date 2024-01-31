import { AxiosResponse } from "axios";
import { BASE_URL, httpClient } from "../config/develop-config";

const getFactory = async (params: object) => {
  return await httpClient
    .get(`${BASE_URL}/auth/factory`, { params })
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export { getFactory };
