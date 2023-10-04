import { ProductEntity } from "./PoductEntity";

export interface ProductShopList {
  count: number;
  data: ProductShopEntity[];
}

export interface ProductShopEntity {
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
}
