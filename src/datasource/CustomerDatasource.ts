import { BASE_URL, httpClient } from "../config/develop-config";

export class CustomerDatasource {
  static getCustomer(
    pageNum: number,
    pageSize: number,
    customerId: number
  ): Promise<any> {
    const params = {
        page_number: pageNum,
        page_size: pageSize,
    };
    return httpClient
      .get(`${BASE_URL}/customerpricelist/getByComId/${customerId}`, { params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err getCustomer");
      });
  }
}
