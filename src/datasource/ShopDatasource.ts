import { BASE_URL, httpClient } from "../config/develop-config";

export class ShopDatasource {
  static getCustomer(
    pageNum: number,
    pageSize: number,
    companyId: number
  ): Promise<any> {
    const params = {
      page_number: pageNum,
      page_size: pageSize,
      comp_id: companyId,
    };
    return httpClient
      .get(`${BASE_URL}/customerpricelist/getByComId/`, { params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err getCustomer");
      });
  }

  static getByCusPriceId(
    customerId: number,
    pageNum: number,
    pageSize: number
  ): Promise<any> {
    const params = {
      page_number: pageNum,
      page_size: pageSize,
    };
    return httpClient
      .get(`${BASE_URL}/customerpricelist/getByCusId/${customerId}`, { params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "getByCusPriceId");
      });
  }
}
