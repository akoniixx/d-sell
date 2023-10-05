import { Dayjs } from "dayjs";

export interface CustomerEntity {
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
export interface CustomerEntityByZone {
  zone?: string;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  searchText?: any;
  page?: number;
  take?: number;
}

export interface CustomerCompanyName {
  company: string;
  zone: string;
  creditLimit: number;
  customerId: string;
  customerName: string;
  customerNo: string;
  customerType: string;
  isActive: boolean;
  isNav: boolean;
  salePersonCode: string;
  productBrand: {
    company: string;
    product_brand_id: string;
    product_brand_name: string;
  }[];
  updateDate: string;
  updateBy: string;
  createDate: string;
  termPayment?: string;
}
export interface CustomerEntityShopList {
  address?: string;
  createDate?: string;

  customerCompany: CustomerCompanyName[];
  userShop?: {
    email: string;
    firstname: string;
    idCard: string;
    lastname: string;
    nametitle: string;
    secondtelephone: string | null;
    telephone: string | null;
    isActive: boolean;
    isPrimary: boolean;
  };
  province?: string;
  telephone?: string;
  postcode?: string;
  district?: string;
  customerId?: string;
  subdistrict?: string;
  taxNo?: string;
  updateBy?: string;
  updateDate?: string;
}

export interface CustomerDetailEntity {
  action: string;
  data: {
    address: string;
    createDate: string;
    customerCompany: CustomerCompanyName[];
    customerId: string;
    customerToUserShops: CustomerEntityShopList[];
    district: string;
    lag: string | null;
    lat: string | null;
    postcode: string;
    province: string;
    subdistrict: string;
    telephone: string;
    taxNo: string;
    updateBy: string;
    updateDate: string;
  };
}
export interface CustomerEntityShopListIndex {
  address: string;
  createDate: string;
  customerCompany: CustomerCompanyName[];
  customerId: string;
  customerToUserShops: CustomerEntityShopList[];
  district: string;
  lag: string | null;
  lat: string | null;
  postcode: string;
  province: string;
  subdistrict: string;
  telephone: string;
  taxNo: string;
  updateBy: string;
  updateDate: string;
}
export interface FormStepCustomerEntity {
  address: string;
  createDate: Dayjs;
  district: string;
  email: string;
  firstname: string;
  lastname: string;
  idCard: string;
  lat: string;
  lag: string;
  memberId: string;
  nametitle: string;
  nickname: string;
  postcode: string;
  province: string;
  subdistrict: string;
  secondtelephone: string | null;
  telephone: string;
  taxId: string;
  updateBy?: string;
  updateDate: string;
  customerName: string;
  isActive: boolean;
  isActiveCustomer: boolean;
  isPrimary: boolean;
  position: string;
  typeShop: string;
  primaryId: string;
  zone: string;
  userShopId: string;
  productBrand: any;
  salePersonCode: string;
  termPayment: string;
  customerCompanyId?: number;
  customerNo?: string | null;
}
export interface PayloadCustomerEntity {
  customerId?: number | null;
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  telephone?: string;
  taxNo: string;
  updateBy?: string;
  lat: string;
  lag: string;
  customerCompany: {
    customerId?: number | null;
    isNav: boolean;
    customerName: string;
    company: string;
    customerType: string;
    creditLimit: number;
    zone: string;
    termPayment?: string;
    isActive: boolean;
    salePersonCode: string;
    updateBy?: string;
    customerCompanyId?: number;
    customerNo?: string | null;
    productBrand?: string;
  }[];
  userShop: {
    firstname: string;
    lastname: string;
    nickname: string;
    telephone: string;
    isActive: boolean;
    isPrimary: boolean;
    primaryId?: string;
    position: string;
    idCard: string;
    updateBy?: string;
    nametitle: string;
    secondtelephone: string | null;
    email: string;
    userShopId?: string | null;
  };
}
export interface PayloadApproveCustomerEntity {
  text?: string;
  page: number;
  take: number;
  isApprove: string;
  company: string;
  zone?: string;
}

export interface CusComEntity {
  company: string;
  customerCompanyId: string;
  customerId: string;
  customerName: string;
  customerNo: string;
  zone: string;
}
