// export interface ProductListEntity {
//     productId: number;
//     companyId: number;
//     locationId: number;
//     productBrandId: number;
//     productNoNAV: string,
//     productName: string;
//     packSize: string;
//     qtySaleUnit: number;
//     commonName: string;
//     baseUOM: string;
//     packingUOM: string;
//     saleUOM: string;
//     productGroup: string;
//     inventoryGroup: string;
//     productCategoryId: number;
//     productStrategy: string;
//     marketPrice: number;
//     unitPrice: number;
//     isActive: boolean;
//     createDate: string;
//     updateDate: string;
//     vatStatus: string;
//     productDescription: string;
//     productImage: string;
//     locationName: string;
//     productCategoryName: string;
//   }

import { ProductListItemEntity } from "./ProductListItemEntity";


export interface ProductListEntity{
  productId: ProductListItemEntity[],
  total: number
}
