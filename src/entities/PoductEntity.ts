export interface ProductEntity {
  productId: string | number;
  baseUOM?: string;
  commonName?: string;
  company?: string;
  createDate?: string;
  description?: string;
  inventoryGroup?: string;
  marketPrice?: string;
  packSize?: string;
  packingUOM?: string;
  productBrandId?: string;
  productBrand?: Object;
  productCategoryId?: string;
  productCategory?: Object;
  productCodeNAV?: string;
  productGroup?: string;
  productImage?: string;
  productLocation?: string;
  productName?: string;
  productStatus?: string;
  productStrategy?: string;
  qtySaleUnit?: number;
  saleUOM?: string;
  unitPrice?: string;
  updateBy?: string;
  updateDate?: string;
}
