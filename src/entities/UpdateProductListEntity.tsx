import { UpdateProductListModel } from "../components/Models/UpdateProductListModel"

export interface UpdateProductListEntity{
    productId: number;
    companyId: number;
    locationId: number;
    productBrandId: number;
    productNoNAV: string,
    productName: string;
    packSize: string;
    qtySaleUnit: number;
    commonName: string;
    baseUOM: string;
    packingUOM: string;
    saleUOM: string;
    productGroup: string;
    inventoryGroup: string;
    productCategoryId: number;
    productStrategy: string;
    marketPrice: number;
    unitPrice: number;
    isActive: string;
    createDate: string;
    updateDate: string;
    vatStatus: string;
    productDescription: string;
    productImage: string;
    locationName: string;
    productCategoryName: string;
}

export class UpdateProductListEntityUtil{
    fromModel(data: UpdateProductListModel, productImage: string): UpdateProductListEntity{
        const priceListEntity = {
            "productId": data.productId,
            "companyId": data.companyId,
            "locationId": data.locationId,
            "productBrandId": data.productBrandId,
            "productNoNAV": data.productNoNAV,
            "productName": data.productName,
            "packSize": data.packSize,
            "qtySaleUnit": data.qtySaleUnit,
            "commonName": data.commonName,
            "baseUOM": data.baseUOM,
            "packingUOM": data.packingUOM,
            "saleUOM": data.saleUOM,
            "productGroup": data.productGroup,
            "inventoryGroup": data.inventoryGroup,
            "productCategoryId": data.productCategoryId,
            "productStrategy": data.productStrategy,
            "marketPrice": data.marketPrice,
            "unitPrice": data.unitPrice,
            "isActive": data.isActive,
            "createDate": data.createDate,
            "updateDate": data.updateDate,
            "vatStatus": data.vatStatus,
            "productDescription": data.productDescription,
            "productImage": data.productImage,
            "locationName": data.locationName,
            "productCategoryName": data.productCategoryName
        }
        return priceListEntity
    }
}
