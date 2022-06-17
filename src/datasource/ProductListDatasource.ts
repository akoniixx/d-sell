import { BASE_URL, httpClient } from "../config/develop-config";
import { ProductListItemEntity } from "../entities/ProductListItemEntity";

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

  static getProductListByID(productId: number): Promise<ProductListItemEntity> {
    return httpClient
      .get(`${BASE_URL}/product/getByProductId/${productId}`  )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err, "err getProductListById");
      });
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

  // static updateProductListById(data: UpdateProductListEntity, productId: number): Promise<ProductListItemEntity> {
  //   return httpClient
  //     .put(BASE_URL + '/product/getByGroupProduct/1' + productId, data)
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }
}
