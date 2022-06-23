export interface ShopItemsEntity {
  data: ShopItemsDetailEntity[];
}

export interface ShopItemsDetailEntity {
  customerId: number;
  companyId: number;
  customerNoNav: string;
  customerName: string;
  address: string;
  district: string;
  subdistrict: string;
  province: string;
  postcode: string;
  phone: string;
  vatId: string;
  saleZone: string;
  termPayment: string;
  creditLimit: string;
  isActive: boolean;
  customerType: string;
  updateDate: string;
  createDate: string;
  salePerson: string;
  shopIdIMC: string;
}

export const ShopItemsDetailEntity_INIT: ShopItemsDetailEntity = {
  customerId: 0,
  companyId: 0,
  customerNoNav: "",
  customerName: "",
  address: "",
  district: "",
  subdistrict: "",
  province: "",
  postcode: "",
  phone: "",
  vatId: "",
  saleZone: "",
  termPayment: "",
  creditLimit: "",
  isActive: true,
  customerType: "",
  updateDate: "",
  createDate: "",
  salePerson: "",
  shopIdIMC: "",
};

export interface ShopDelete {
  customerId: number;
}

export class ShopItemsDetailEntityUtil {
  fromEntity(data: ShopItemsDetailEntity): ShopItemsDetailEntity {
    const itemShopEntity = {
      customerId: data.customerId,
      companyId: data.companyId,
      customerNoNav: data.customerNoNav,
      customerName: data.customerName,
      address: data.address,
      district: data.district,
      subdistrict: data.subdistrict,
      province: data.province,
      postcode: data.postcode,
      phone: data.phone,
      vatId: data.vatId,
      saleZone: data.saleZone,
      termPayment: data.termPayment,
      creditLimit: data.creditLimit,
      isActive: data.isActive,
      customerType: data.customerType,
      updateDate: data.updateDate,
      createDate: data.createDate,
      salePerson: data.salePerson,
      shopIdIMC: data.shopIdIMC,
    };

    return itemShopEntity;
  }
}
