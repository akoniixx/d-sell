import { ProductEntity } from "./PoductEntity";

export interface ProductShopList {
  count: number;
  data: IndexProductShop[];
}
export interface IndexProductShop {
  customerCompanyId: number;
  customerNo: string;
  customerName: string;
  zone: string;
  totalProduct: string;
}

export interface DetailProductShopEntity {
  count: number;
  data: [
    {
      productShopId: string;
      company: string;
      productId: string;
      customerCompanyId: number;
      customerId: number;
      customerNo: string;
      customerName: string;
      zone: string;
      createdAt: string;
      createBy: string;
      product: ProductEntity[];
    },
  ];
}

export interface CreateProductShopEntity {
  company: string;
  customerCompanyId: number;
  customerId: number;
  customerNo: string;
  customerName: string;
  zone: string;
  createBy: string;
  productIdList: {
    productId: number;
  }[];
}
