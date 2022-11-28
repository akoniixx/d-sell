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
  productBrand: [];
}
export interface CustomerEntityShopList {
  address?: string;
  createDate?: string;
  customerCompany: CustomerCompanyName[];
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
