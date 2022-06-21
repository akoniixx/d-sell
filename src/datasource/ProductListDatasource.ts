import { BASE_URL, httpClient } from "../config/develop-config";
import { UpdateProductListEntity } from "../entities/UpdateProductListEntity";

export class ProductListDatasource {
  static getProductList(
    pageNum: number,
    pageSize: number,
    companyId: number,
    search?: string,
    productGroup?: string,
    productStrategy?: string

  ): Promise<any> {
    const params = {
      page_number: pageNum,
      page_size: pageSize,
      search: search,
      prod_group: productGroup,
      prod_strategy: productStrategy
    };
    return httpClient
      .get(`${BASE_URL}/product/getByGroupProduct/${companyId}`, { params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err getProductList");
      });
  }

  static getProductListByID(productId: number): Promise<any> {
    return httpClient
      .get(`${BASE_URL}/product/getByProductId/${productId}`  )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err getProductListById");
      });
  }
  static updateProductListById(data: UpdateProductListEntity, productId: number): Promise<any> {
    return httpClient
      .post(`${BASE_URL}/product/updateProductByProductId/${productId}` ,data)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log(err, 'err UpdateProductById')
      })
  }

  static getProductGroup(companyId: number): Promise<any>{
    return httpClient
    .get(`${BASE_URL}/productgroup/getByCompId/${companyId}`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err, 'err getProductGroup')
    })

  }
  static getProductStrategy(): Promise<any>{
    return httpClient
    .get(`${BASE_URL}/productstrategy/getComLadda/`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err, 'err getProductstrategy')
    })

  }

}
